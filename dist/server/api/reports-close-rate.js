// src/server/api/reports-close-rate.ts
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmDeals, crmPipelineStages } from '@/lib/feature-pack-schemas';
import { eq, sql, inArray } from 'drizzle-orm';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
/**
 * GET /api/crm/reports/close-rate
 * Get close rate KPI
 */
export async function GET(request) {
    try {
        const db = getDb();
        // Get all closed won deals
        const closedWonStages = await db
            .select({ id: crmPipelineStages.id })
            .from(crmPipelineStages)
            .where(eq(crmPipelineStages.isClosedWon, true));
        const closedWonStageIds = closedWonStages.map((s) => s.id);
        // Get all closed lost deals
        const closedLostStages = await db
            .select({ id: crmPipelineStages.id })
            .from(crmPipelineStages)
            .where(eq(crmPipelineStages.isClosedLost, true));
        const closedLostStageIds = closedLostStages.map((s) => s.id);
        // Count closed won deals
        const wonCount = closedWonStageIds.length > 0
            ? await db
                .select({ count: sql `count(*)` })
                .from(crmDeals)
                .where(inArray(crmDeals.pipelineStage, closedWonStageIds))
            : [{ count: 0 }];
        // Count closed lost deals
        const lostCount = closedLostStageIds.length > 0
            ? await db
                .select({ count: sql `count(*)` })
                .from(crmDeals)
                .where(inArray(crmDeals.pipelineStage, closedLostStageIds))
            : [{ count: 0 }];
        const won = Number(wonCount[0]?.count || 0);
        const lost = Number(lostCount[0]?.count || 0);
        const total = won + lost;
        const closeRate = total > 0 ? (won / total) * 100 : 0;
        return NextResponse.json({
            closeRate: Math.round(closeRate * 100) / 100,
            won,
            lost,
            total,
        });
    }
    catch (error) {
        console.error('[crm] Get close rate error:', error);
        return NextResponse.json({ error: 'Failed to calculate close rate' }, { status: 500 });
    }
}
//# sourceMappingURL=reports-close-rate.js.map