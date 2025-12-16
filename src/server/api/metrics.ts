// src/server/api/metrics.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmDeals, crmCompanies, crmContacts, crmPipelineStages } from '@/lib/feature-pack-schemas';
import { sql, eq, gte, or } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/crm/metrics
 * Get CRM metrics including counts and weekly deals data
 */
export async function GET(request: NextRequest) {
  try {
    const db = getDb();

    // Get total counts
    const [companiesCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(crmCompanies);
    
    const [contactsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(crmContacts);
    
    const [dealsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(crmDeals);

    const totalCompanies = Number(companiesCount?.count || 0);
    const totalContacts = Number(contactsCount?.count || 0);
    const totalDeals = Number(dealsCount?.count || 0);

    // Get pipeline stages to identify closed-won stages
    const stages = await db.select().from(crmPipelineStages);
    const closedWonStageIds = stages
      .filter((s: typeof stages[0]) => s.isClosedWon)
      .map((s: typeof stages[0]) => s.id);

    // Calculate pipeline value (all deals)
    const [pipelineValueResult] = await db
      .select({ total: sql<number>`coalesce(sum(${crmDeals.amount}), 0)` })
      .from(crmDeals);
    
    const pipelineValue = Number(pipelineValueResult?.total || 0);

    // Calculate won value (deals in closed-won stages)
    let wonValue = 0;
    if (closedWonStageIds.length > 0) {
      // Use IN clause for multiple stage IDs
      const conditions = closedWonStageIds.map((id: string) => eq(crmDeals.pipelineStage, id));
      const whereClause = conditions.length === 1 ? conditions[0] : or(...conditions);
      const [wonValueResult] = await db
        .select({ total: sql<number>`coalesce(sum(${crmDeals.amount}), 0)` })
        .from(crmDeals)
        .where(whereClause);
      
      wonValue = Number(wonValueResult?.total || 0);
    }

    // Get deals for the last 4 weeks (grouped by week)
    // Calculate the start date (4 weeks ago, start of that week)
    const now = new Date();
    const fourWeeksAgo = new Date(now);
    fourWeeksAgo.setDate(now.getDate() - 28); // 4 weeks = 28 days
    
    // Get start of week (Monday) for 4 weeks ago
    const dayOfWeek = fourWeeksAgo.getDay();
    const diff = fourWeeksAgo.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday
    const startOfWeek = new Date(fourWeeksAgo);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // Get all deals created in the last 4 weeks
    const recentDeals = await db
      .select({
        id: crmDeals.id,
        amount: crmDeals.amount,
        createdOnTimestamp: crmDeals.createdOnTimestamp,
      })
      .from(crmDeals)
      .where(gte(crmDeals.createdOnTimestamp, startOfWeek));

    // Group deals by week
    const weeklyData: Array<{ week: string; count: number; totalAmount: number }> = [];
    
    // Initialize 4 weeks of data
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(startOfWeek);
      weekStart.setDate(startOfWeek.getDate() + i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekKey = weekStart.toISOString().split('T')[0];
      
      // Filter deals for this week
      const weekDeals = recentDeals.filter((deal: typeof recentDeals[0]) => {
        const dealDate = new Date(deal.createdOnTimestamp);
        return dealDate >= weekStart && dealDate <= weekEnd;
      });
      
      const count = weekDeals.length;
      const totalAmount = weekDeals.reduce((sum: number, deal: typeof recentDeals[0]) => {
        return sum + Number(deal.amount || 0);
      }, 0);
      
      weeklyData.push({
        week: weekKey,
        count,
        totalAmount,
      });
    }

    // Format response to match expected structure
    return NextResponse.json({
      totals: {
        companies: totalCompanies,
        contacts: totalContacts,
        deals: totalDeals,
        // Keep legacy fields for backward compatibility but map to new values
        leads: totalContacts, // Contacts can be considered leads
        opportunities: totalDeals, // Deals are opportunities
        accounts: totalCompanies, // Companies are accounts
        activities: 0, // Not tracking activities count in this endpoint
      },
      pipeline: {
        totalValue: pipelineValue,
        wonValue: wonValue,
      },
      dealsWeekly: weeklyData,
      // Legacy structure for backward compatibility
      leads: {
        byStatus: [],
        recentConversions: 0,
      },
      opportunities: {
        byStage: [],
      },
      activities: {
        byStatus: [],
      },
    });
  } catch (error) {
    console.error('[crm/metrics] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}

