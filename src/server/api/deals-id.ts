// src/server/api/deals-id.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmDeals } from '@/lib/feature-pack-schemas';
import { eq } from 'drizzle-orm';
import { getUserId } from '../auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function extractId(request: NextRequest): string | null {
  const url = new URL(request.url);
  const parts = url.pathname.split('/');
  // /api/crm/deals/{id} -> id is last part
  return parts[parts.length - 1] || null;
}

/**
 * GET /api/crm/deals/[id]
 */
export async function GET(request: NextRequest) {
  try {
    const id = extractId(request);
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const db = getDb();
    const [deal] = await db
      .select()
      .from(crmDeals)
      .where(eq(crmDeals.id, id));

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json(deal);
  } catch (error) {
    console.error('[crm] Get deal error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deal' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/crm/deals/[id]
 */
export async function PUT(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = extractId(request);
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const body = await request.json();
    const db = getDb();

    // If pipelineStage is changing, update stageEnteredAt
    const updateData: any = {
      ...body,
      lastUpdatedByUserId: userId,
      lastUpdatedOnTimestamp: new Date(),
    };
    
    if (body.pipelineStage) {
      updateData.stageEnteredAt = new Date();
    }

    const [deal] = await db
      .update(crmDeals)
      .set(updateData)
      .where(eq(crmDeals.id, id))
      .returning();

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json(deal);
  } catch (error) {
    console.error('[crm] Update deal error:', error);
    return NextResponse.json(
      { error: 'Failed to update deal' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/crm/deals/[id]
 */
export async function DELETE(request: NextRequest) {
  try {
    const id = extractId(request);
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const db = getDb();
    const [deal] = await db
      .delete(crmDeals)
      .where(eq(crmDeals.id, id))
      .returning();

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[crm] Delete deal error:', error);
    return NextResponse.json(
      { error: 'Failed to delete deal' },
      { status: 500 }
    );
  }
}

