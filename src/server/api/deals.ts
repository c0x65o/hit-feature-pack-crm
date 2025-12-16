// src/server/api/deals.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmDeals } from '@/lib/feature-pack-schemas';
import { eq, desc, asc, like, sql, and, or, type AnyColumn } from 'drizzle-orm';
import { getUserId } from '../auth';

// Required for Next.js App Router
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/crm/deals
 * List all deals
 */
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '25', 10);
    const offset = (page - 1) * pageSize;

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdOnTimestamp';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Filters
    const search = searchParams.get('search') || '';
    const ownerUserId = searchParams.get('ownerUserId') || null;
    const companyId = searchParams.get('companyId') || null;
    const pipelineStage = searchParams.get('pipelineStage') || null;

    // Build where conditions
    const conditions = [];
    if (search) {
      conditions.push(like(crmDeals.dealName, `%${search}%`));
    }
    if (ownerUserId) {
      conditions.push(eq(crmDeals.ownerUserId, ownerUserId));
    }
    if (companyId) {
      conditions.push(eq(crmDeals.companyId, companyId));
    }
    if (pipelineStage) {
      conditions.push(eq(crmDeals.pipelineStage, pipelineStage));
    }

    // Apply sorting
    const sortColumns: Record<string, AnyColumn> = {
      id: crmDeals.id,
      dealName: crmDeals.dealName,
      amount: crmDeals.amount,
      createdOnTimestamp: crmDeals.createdOnTimestamp,
      lastUpdatedOnTimestamp: crmDeals.lastUpdatedOnTimestamp,
    };
    const orderCol = sortColumns[sortBy] ?? crmDeals.createdOnTimestamp;
    const orderDirection = sortOrder === 'asc' ? asc(orderCol) : desc(orderCol);

    // Build where clause
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count for pagination
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(crmDeals);
    const countResult = whereClause
      ? await countQuery.where(whereClause)
      : await countQuery;
    const total = Number(countResult[0]?.count || 0);

    // Execute main query
    const baseQuery = db.select().from(crmDeals);
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
    console.error('[crm] List deals error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crm/deals
 * Create a new deal
 */
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();

    // Validate required fields
    if (!body.dealName) {
      return NextResponse.json(
        { error: 'Deal name is required' },
        { status: 400 }
      );
    }
    if (!body.amount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      );
    }
    if (!body.pipelineStage) {
      return NextResponse.json(
        { error: 'Pipeline stage is required' },
        { status: 400 }
      );
    }

    // Get user ID for audit fields
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await db.insert(crmDeals).values({
      dealName: body.dealName as string,
      amount: body.amount as string,
      closeDateEstimate: body.closeDateEstimate ? new Date(body.closeDateEstimate) : null,
      ownerUserId: body.ownerUserId || userId,
      companyId: body.companyId || null,
      primaryContactId: body.primaryContactId || null,
      pipelineStage: body.pipelineStage as string,
      stageEnteredAt: new Date(),
      createdByUserId: userId,
      lastUpdatedByUserId: userId,
    }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('[crm] Create deal error:', error);
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    );
  }
}

