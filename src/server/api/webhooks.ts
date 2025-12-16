// src/server/api/webhooks.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmWebhookConfigs } from '@/lib/feature-pack-schemas';
import { eq, desc, asc, like, sql, and, type AnyColumn } from 'drizzle-orm';
import { getUserId } from '../auth';

// Required for Next.js App Router
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/crm/webhooks
 * List webhook configurations
 */
export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '25', 10);
    const offset = (page - 1) * pageSize;

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdOnTimestamp';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where conditions
    const conditions: ReturnType<typeof eq>[] = [];

    // Apply sorting
    const sortColumns: Record<string, AnyColumn> = {
      id: crmWebhookConfigs.id,
      webhookUrl: crmWebhookConfigs.webhookUrl,
      createdOnTimestamp: crmWebhookConfigs.createdOnTimestamp,
      lastUpdatedOnTimestamp: crmWebhookConfigs.lastUpdatedOnTimestamp,
    };
    const orderCol = sortColumns[sortBy] ?? crmWebhookConfigs.createdOnTimestamp;
    const orderDirection = sortOrder === 'asc' ? asc(orderCol) : desc(orderCol);

    // Build where clause
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count for pagination
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(crmWebhookConfigs);
    const countResult = whereClause
      ? await countQuery.where(whereClause)
      : await countQuery;
    const total = Number(countResult[0]?.count || 0);

    // Execute main query
    const baseQuery = db.select().from(crmWebhookConfigs);
    const items = whereClause
      ? await baseQuery.where(whereClause).orderBy(orderDirection).limit(pageSize).offset(offset)
      : await baseQuery.orderBy(orderDirection).limit(pageSize).offset(offset);

    return NextResponse.json({
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('[crm] List webhooks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch webhooks' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crm/webhooks
 * Create a new webhook configuration
 */
export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const body = await request.json();

    // Validate required fields
    if (!body.webhookUrl) {
      return NextResponse.json(
        { error: 'Webhook URL is required' },
        { status: 400 }
      );
    }
    if (!body.events || !Array.isArray(body.events)) {
      return NextResponse.json(
        { error: 'Events array is required' },
        { status: 400 }
      );
    }

    const result = await db.insert(crmWebhookConfigs).values({
      customerId: body.customerId || null,
      webhookUrl: body.webhookUrl as string,
      isEnabled: body.isEnabled !== undefined ? body.isEnabled : true,
      events: body.events,
      secret: body.secret || null,
      createdByUserId: userId,
      lastUpdatedByUserId: userId,
    }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('[crm] Create webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to create webhook' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/crm/webhooks
 * Update a webhook configuration (requires id in body)
 */
export async function PUT(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { error: 'Webhook ID is required' },
        { status: 400 }
      );
    }

    const db = getDb();

    const [webhook] = await db
      .update(crmWebhookConfigs)
      .set({
        webhookUrl: body.webhookUrl,
        isEnabled: body.isEnabled,
        events: body.events,
        secret: body.secret,
        lastUpdatedByUserId: userId,
        lastUpdatedOnTimestamp: new Date(),
      })
      .where(eq(crmWebhookConfigs.id, body.id))
      .returning();

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    return NextResponse.json(webhook);
  } catch (error) {
    console.error('[crm] Update webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to update webhook' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/crm/webhooks
 * Delete a webhook configuration (requires id in query params)
 */
export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Webhook ID is required' },
        { status: 400 }
      );
    }

    const db = getDb();
    const [webhook] = await db
      .delete(crmWebhookConfigs)
      .where(eq(crmWebhookConfigs.id, id))
      .returning();

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[crm] Delete webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to delete webhook' },
      { status: 500 }
    );
  }
}

