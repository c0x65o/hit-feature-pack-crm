// src/server/api/reports-sales-cycle.ts
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmDeals, crmPipelineStages } from '@/lib/feature-pack-schemas';
import { eq, sql, inArray } from 'drizzle-orm';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
/**
 * GET /api/crm/reports/sales-cycle
 * Get average sales cycle length KPI
 */
export async function GET(request) {
    try {
        const db = getDb();
        // Get closed won stage IDs
        const closedWonStages = await db
            .select({ id: crmPipelineStages.id })
            .from(crmPipelineStages)
            .where(eq(crmPipelineStages.isClosedWon, true));
        const closedWonStageIds = closedWonStages.map((s) => s.id);
        if (closedWonStageIds.length === 0) {
            return NextResponse.json({
                averageDays: 0,
                count: 0,
            });
        }
        // Calculate average days from creation to close for closed won deals
        const result = await db
            .select({
            avgDays: sql `AVG(EXTRACT(EPOCH FROM (${crmDeals.lastUpdatedOnTimestamp} - ${crmDeals.createdOnTimestamp})) / 86400)`,
            count: sql `count(*)`,
        })
            .from(crmDeals)
            .where(inArray(crmDeals.pipelineStage, closedWonStageIds));
        const averageDays = result[0]?.avgDays ? Number(result[0].avgDays) : 0;
        const count = Number(result[0]?.count || 0);
        return NextResponse.json({
            averageDays: Math.round(averageDays * 100) / 100,
            count,
        });
    }
    catch (error) {
        console.error('[crm] Get sales cycle error:', error);
        return NextResponse.json({ error: 'Failed to calculate sales cycle' }, { status: 500 });
    }
}
//# sourceMappingURL=reports-sales-cycle.js.map