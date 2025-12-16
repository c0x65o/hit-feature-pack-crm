// src/server/api/pipeline-stages.ts
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmPipelineStages } from '@/lib/feature-pack-schemas';
import { asc, eq } from 'drizzle-orm';
import { getUserId } from '../auth';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
function normalizeStageCode(input) {
    if (typeof input !== 'string')
        return null;
    const trimmed = input.trim();
    if (!trimmed)
        return null;
    const normalized = trimmed
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
    if (!normalized)
        return null;
    return normalized;
}
/**
 * GET /api/crm/pipeline-stages
 * List all pipeline stages ordered by order field
 */
export async function GET(request) {
    try {
        const db = getDb();
        const stages = await db
            .select()
            .from(crmPipelineStages)
            .orderBy(asc(crmPipelineStages.order));
        return NextResponse.json({ items: stages });
    }
    catch (error) {
        console.error('[crm/pipeline-stages] List error:', error);
        return NextResponse.json({ error: 'Failed to fetch pipeline stages' }, { status: 500 });
    }
}
/**
 * POST /api/crm/pipeline-stages
 * Create a new pipeline stage
 * Requires: code, name, order
 */
export async function POST(request) {
    try {
        const db = getDb();
        const body = await request.json();
        // Validate required fields
        if (body.code === undefined || body.code === null || typeof body.code !== 'string' || !body.code.trim()) {
            return NextResponse.json({ error: 'Code is required (e.g. "qualified" or "closed_won")' }, { status: 400 });
        }
        const code = normalizeStageCode(body.code);
        if (!code) {
            return NextResponse.json({ error: 'Code is invalid (use letters/numbers/underscores)' }, { status: 400 });
        }
        if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }
        if (body.order === undefined || body.order === null) {
            return NextResponse.json({ error: 'Order is required' }, { status: 400 });
        }
        const order = Number.parseInt(String(body.order), 10);
        if (!Number.isFinite(order) || Number.isNaN(order)) {
            return NextResponse.json({ error: 'Order must be a number' }, { status: 400 });
        }
        // Get user from request
        const userId = getUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // Validate final-stage flags
        if (body.isClosedWon && body.isClosedLost) {
            return NextResponse.json({ error: 'A stage cannot be both Closed Won and Closed Lost' }, { status: 400 });
        }
        // Prevent clients from creating "system" stages via API.
        if (body.isSystem !== undefined) {
            return NextResponse.json({ error: 'isSystem cannot be set via API' }, { status: 400 });
        }
        // Enforce single Closed Won/Closed Lost stages
        if (body.isClosedWon) {
            const existingWon = await db
                .select({ id: crmPipelineStages.id })
                .from(crmPipelineStages)
                .where(eq(crmPipelineStages.isClosedWon, true))
                .limit(1);
            if (existingWon.length > 0) {
                return NextResponse.json({ error: 'A Closed Won stage already exists. Update the existing stage instead.' }, { status: 409 });
            }
        }
        if (body.isClosedLost) {
            const existingLost = await db
                .select({ id: crmPipelineStages.id })
                .from(crmPipelineStages)
                .where(eq(crmPipelineStages.isClosedLost, true))
                .limit(1);
            if (existingLost.length > 0) {
                return NextResponse.json({ error: 'A Closed Lost stage already exists. Update the existing stage instead.' }, { status: 409 });
            }
        }
        // Create stage
        const result = await db.insert(crmPipelineStages).values({
            code,
            name: body.name.trim(),
            order,
            isClosedWon: body.isClosedWon || false,
            isClosedLost: body.isClosedLost || false,
            customerConfig: body.customerConfig || null,
            createdByUserId: userId,
        }).returning();
        return NextResponse.json(result[0], { status: 201 });
    }
    catch (error) {
        console.error('[crm/pipeline-stages] Create error:', error);
        // Handle unique constraint violation (duplicate code)
        if (error?.code === '23505' || error?.message?.includes('unique')) {
            return NextResponse.json({ error: 'A pipeline stage with this code already exists' }, { status: 409 });
        }
        const errorMessage = error?.message || error?.detail || 'Failed to create pipeline stage';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
//# sourceMappingURL=pipeline-stages.js.map