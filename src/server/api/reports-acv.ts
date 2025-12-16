// src/server/api/reports-acv.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmDeals, crmPipelineStages } from '@/lib/feature-pack-schemas';
import { eq, sql, inArray } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/crm/reports/acv
 * Get average contract value (ACV) KPI
 */
export async function GET(request: NextRequest) {
  try {
    const db = getDb();

    // Get closed won stage IDs
    const closedWonStages = await db
      .select({ id: crmPipelineStages.id })
      .from(crmPipelineStages)
      .where(eq(crmPipelineStages.isClosedWon, true));

    const closedWonStageIds = closedWonStages.map((s: { id: string }) => s.id);

    if (closedWonStageIds.length === 0) {
      return NextResponse.json({
        acv: 0,
        count: 0,
        total: 0,
      });
    }

    // Calculate average amount for closed won deals
    const result = await db
      .select({
        avg: sql<number>`AVG(${crmDeals.amount}::numeric)`,
        count: sql<number>`count(*)`,
        total: sql<number>`SUM(${crmDeals.amount}::numeric)`,
      })
      .from(crmDeals)
      .where(inArray(crmDeals.pipelineStage, closedWonStageIds));

    const acv = result[0]?.avg ? Number(result[0].avg) : 0;
    const count = Number(result[0]?.count || 0);
    const total = result[0]?.total ? Number(result[0].total) : 0;

    return NextResponse.json({
      acv: Math.round(acv * 100) / 100,
      count,
      total: Math.round(total * 100) / 100,
    });
  } catch (error) {
    console.error('[crm] Get ACV error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate ACV' },
      { status: 500 }
    );
  }
}

