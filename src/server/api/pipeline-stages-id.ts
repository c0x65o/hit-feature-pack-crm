// src/server/api/pipeline-stages-id.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmPipelineStages, crmDeals } from '@/lib/feature-pack-schemas';
import { and, eq, ne, sql } from 'drizzle-orm';
import { getUserId } from '../auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function normalizeStageCode(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  const normalized = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  if (!normalized) return null;
  return normalized;
}

function extractId(request: NextRequest): string | null {
  const url = new URL(request.url);
  const parts = url.pathname.split('/');
  // /api/crm/pipeline-stages/{id} -> id is last part
  return parts[parts.length - 1] || null;
}

/**
 * GET /api/crm/pipeline-stages/[id]
 * Get a single pipeline stage by ID
 */
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const id = extractId(request);
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const stage = await db
      .select()
      .from(crmPipelineStages)
      .where(eq(crmPipelineStages.id, id))
      .limit(1);

    if (stage.length === 0) {
      return NextResponse.json(
        { error: 'Pipeline stage not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(stage[0]);
  } catch (error) {
    console.error('[crm/pipeline-stages/[id]] Get error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pipeline stage' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/crm/pipeline-stages/[id]
 * Update a pipeline stage
 * Code is identity and cannot be changed. Name can be updated.
 */
export async function PUT(request: NextRequest) {
  try {
    const db = getDb();
    const id = extractId(request);
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    const body = await request.json();

    // Get user from request
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if stage exists
    const existing = await db
      .select()
      .from(crmPipelineStages)
      .where(eq(crmPipelineStages.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Pipeline stage not found' },
        { status: 404 }
      );
    }

    // Code cannot be changed (it's the identity)
    if (body.code !== undefined) {
      const nextCode = normalizeStageCode(body.code);
      if (!nextCode || nextCode !== existing[0].code) {
        return NextResponse.json(
          { error: 'Code cannot be changed. Code is the identity of a pipeline stage.' },
          { status: 400 }
        );
      }
    }

    // Prevent clients from changing system flag via API.
    if (body.isSystem !== undefined) {
      return NextResponse.json(
        { error: 'isSystem cannot be changed via API' },
        { status: 400 }
      );
    }

    // Validate name if provided
    if (body.name !== undefined) {
      if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
        return NextResponse.json(
          { error: 'Name cannot be empty' },
          { status: 400 }
        );
      }
    }

    // Validate final-stage flags
    const nextClosedWon = body.isClosedWon !== undefined ? Boolean(body.isClosedWon) : Boolean(existing[0].isClosedWon);
    const nextClosedLost = body.isClosedLost !== undefined ? Boolean(body.isClosedLost) : Boolean(existing[0].isClosedLost);
    if (nextClosedWon && nextClosedLost) {
      return NextResponse.json(
        { error: 'A stage cannot be both Closed Won and Closed Lost' },
        { status: 400 }
      );
    }

    // Enforce single Closed Won/Closed Lost stages
    if (body.isClosedWon === true) {
      const otherWon = await db
        .select({ id: crmPipelineStages.id })
        .from(crmPipelineStages)
        .where(and(eq(crmPipelineStages.isClosedWon, true), ne(crmPipelineStages.id, id)))
        .limit(1);
      if (otherWon.length > 0) {
        return NextResponse.json(
          { error: 'A Closed Won stage already exists. Unset Closed Won on that stage first.' },
          { status: 409 }
        );
      }
    }

    if (body.isClosedLost === true) {
      const otherLost = await db
        .select({ id: crmPipelineStages.id })
        .from(crmPipelineStages)
        .where(and(eq(crmPipelineStages.isClosedLost, true), ne(crmPipelineStages.id, id)))
        .limit(1);
      if (otherLost.length > 0) {
        return NextResponse.json(
          { error: 'A Closed Lost stage already exists. Unset Closed Lost on that stage first.' },
          { status: 409 }
        );
      }
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      lastUpdatedByUserId: userId,
      lastUpdatedOnTimestamp: new Date(),
    };

    if (body.name !== undefined) {
      updateData.name = body.name.trim();
    }
    if (body.order !== undefined) {
      const order = Number.parseInt(String(body.order), 10);
      if (!Number.isFinite(order) || Number.isNaN(order)) {
        return NextResponse.json(
          { error: 'Order must be a number' },
          { status: 400 }
        );
      }
      updateData.order = order;
    }
    if (body.isClosedWon !== undefined) {
      updateData.isClosedWon = body.isClosedWon;
    }
    if (body.isClosedLost !== undefined) {
      updateData.isClosedLost = body.isClosedLost;
    }
    if (body.customerConfig !== undefined) {
      updateData.customerConfig = body.customerConfig;
    }

    // Update stage
    const result = await db
      .update(crmPipelineStages)
      .set(updateData)
      .where(eq(crmPipelineStages.id, id))
      .returning();

    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error('[crm/pipeline-stages/[id]] Update error:', error);
    
    // Handle unique constraint violation (duplicate code - should not happen if code is not changed)
    if (error?.code === '23505' || error?.message?.includes('unique')) {
      return NextResponse.json(
        { error: 'A pipeline stage with this code already exists' },
        { status: 409 }
      );
    }
    
    const errorMessage = error?.message || error?.detail || 'Failed to update pipeline stage';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/crm/pipeline-stages/[id]
 * Delete a pipeline stage
 * Cannot delete if isSystem = true or if deals exist in this stage
 */
export async function DELETE(request: NextRequest) {
  try {
    const db = getDb();
    const id = extractId(request);
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    // Get user from request
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if stage exists
    const existing = await db
      .select()
      .from(crmPipelineStages)
      .where(eq(crmPipelineStages.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Pipeline stage not found' },
        { status: 404 }
      );
    }

    // Block deletion of system stages
    if (existing[0].isSystem) {
      return NextResponse.json(
        { error: 'Cannot delete system pipeline stage' },
        { status: 400 }
      );
    }

    // Check if any deals are using this stage
    const dealsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(crmDeals)
      .where(eq(crmDeals.pipelineStage, id));

    const count = Number(dealsCount[0]?.count || 0);
    if (count > 0) {
      return NextResponse.json(
        { 
          error: `Cannot delete pipeline stage: ${count} deal(s) are currently in this stage. Please move or delete those deals first.`,
          dealCount: count
        },
        { status: 409 }
      );
    }

    // Delete stage
    const result = await db
      .delete(crmPipelineStages)
      .where(eq(crmPipelineStages.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Pipeline stage not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deleted: result[0] });
  } catch (error: any) {
    console.error('[crm/pipeline-stages/[id]] Delete error:', error);
    const errorMessage = error?.message || error?.detail || 'Failed to delete pipeline stage';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

