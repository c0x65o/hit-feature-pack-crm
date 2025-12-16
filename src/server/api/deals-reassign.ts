// src/server/api/deals-reassign.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmDeals } from '@/lib/feature-pack-schemas';
import { eq, and } from 'drizzle-orm';
import { getUserId } from '../auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/crm/deals/reassign
 * Reassign deals from inactive user to new owner
 */
export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fromUserId, toUserId } = body;

    if (!fromUserId || !toUserId) {
      return NextResponse.json(
        { error: 'fromUserId and toUserId are required' },
        { status: 400 }
      );
    }

    const db = getDb();

    // Update all deals owned by fromUserId to toUserId
    const result = await db
      .update(crmDeals)
      .set({
        ownerUserId: toUserId,
        lastUpdatedByUserId: userId,
        lastUpdatedOnTimestamp: new Date(),
      })
      .where(eq(crmDeals.ownerUserId, fromUserId))
      .returning();

    return NextResponse.json({
      success: true,
      reassignedCount: result.length,
      deals: result,
    });
  } catch (error) {
    console.error('[crm] Reassign deals error:', error);
    return NextResponse.json(
      { error: 'Failed to reassign deals' },
      { status: 500 }
    );
  }
}

