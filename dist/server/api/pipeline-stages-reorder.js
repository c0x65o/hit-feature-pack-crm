// src/server/api/pipeline-stages-reorder.ts
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmPipelineStages } from '@/lib/feature-pack-schemas';
import { asc, eq } from 'drizzle-orm';
import { getUserId } from '../auth';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
/**
 * PUT /api/crm/pipeline-stages/reorder
 * Reorder pipeline stages by providing an array of { id, order } objects
 */
export async function PUT(request) {
    try {
        const db = getDb();
        const body = await request.json();
        // Get user from request
        const userId = getUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // Validate request body
        if (!Array.isArray(body.stages) || body.stages.length === 0) {
            return NextResponse.json({ error: 'stages array is required with at least one { id, order } object' }, { status: 400 });
        }
        // Validate each stage object
        for (const stage of body.stages) {
            if (!stage.id || stage.order === undefined || stage.order === null) {
                return NextResponse.json({ error: 'Each stage must have id and order fields' }, { status: 400 });
            }
        }
        // Update each stage's order in a transaction-like manner
        const updatedStages = [];
        for (const stage of body.stages) {
            const result = await db
                .update(crmPipelineStages)
                .set({
                order: parseInt(stage.order, 10),
                lastUpdatedByUserId: userId,
                lastUpdatedOnTimestamp: new Date(),
            })
                .where(eq(crmPipelineStages.id, stage.id))
                .returning();
            if (result.length > 0) {
                updatedStages.push(result[0]);
            }
        }
        // Return all stages ordered by their new order
        const allStages = await db
            .select()
            .from(crmPipelineStages)
            .orderBy(asc(crmPipelineStages.order));
        return NextResponse.json({
            success: true,
            updated: updatedStages.length,
            stages: allStages
        });
    }
    catch (error) {
        console.error('[crm/pipeline-stages/reorder] Error:', error);
        const errorMessage = error?.message || error?.detail || 'Failed to reorder pipeline stages';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
//# sourceMappingURL=pipeline-stages-reorder.js.map