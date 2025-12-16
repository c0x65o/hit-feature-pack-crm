// src/server/api/reports-pipeline-health.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmDeals, crmPipelineStages } from '@/lib/feature-pack-schemas';
import { eq, sql, asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/crm/reports/pipeline-health
 * Get pipeline health by stage
 */
export async function GET(request: NextRequest) {
  try {
    const db = getDb();

    // Get all pipeline stages ordered by order field
    const stages = await db
      .select()
      .from(crmPipelineStages)
      .orderBy(asc(crmPipelineStages.order));

    // For each stage, get deal count and total value
    const pipelineHealth = await Promise.all(
      stages.map(async (stage: typeof stages[0]) => {
        const dealsResult = await db
          .select({
            count: sql<number>`count(*)`,
            totalValue: sql<number>`COALESCE(SUM(${crmDeals.amount}::numeric), 0)`,
          })
          .from(crmDeals)
          .where(eq(crmDeals.pipelineStage, stage.id));

        return {
          stageId: stage.id,
          stageName: stage.name,
          stageCode: stage.code,
          order: stage.order,
          isClosedWon: stage.isClosedWon,
          isClosedLost: stage.isClosedLost,
          dealCount: Number(dealsResult[0]?.count || 0),
          totalValue: Number(dealsResult[0]?.totalValue || 0),
        };
      })
    );

    return NextResponse.json({
      stages: pipelineHealth,
    });
  } catch (error) {
    console.error('[crm] Get pipeline health error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate pipeline health' },
      { status: 500 }
    );
  }
}

