// src/server/api/companies.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmCompanies } from '@/lib/feature-pack-schemas';
import { eq, desc, asc, like, sql, and, or, type AnyColumn } from 'drizzle-orm';
import { getUserId } from '../auth';

// Required for Next.js App Router
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/crm/companies
 * List all companies
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

    // Search
    const search = searchParams.get('search') || '';

    // Build where conditions
    const conditions = [];
    if (search) {
      conditions.push(
        or(
          like(crmCompanies.name, `%${search}%`),
          like(crmCompanies.companyEmail, `%${search}%`),
          like(crmCompanies.companyPhone, `%${search}%`)
        )!
      );
    }

    // Apply sorting
    const sortColumns: Record<string, AnyColumn> = {
      id: crmCompanies.id,
      name: crmCompanies.name,
      createdOnTimestamp: crmCompanies.createdOnTimestamp,
      lastUpdatedOnTimestamp: crmCompanies.lastUpdatedOnTimestamp,
    };
    const orderCol = sortColumns[sortBy] ?? crmCompanies.createdOnTimestamp;
    const orderDirection = sortOrder === 'asc' ? asc(orderCol) : desc(orderCol);

    // Build where clause
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count for pagination
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(crmCompanies);
    const countResult = whereClause
      ? await countQuery.where(whereClause)
      : await countQuery;
    const total = Number(countResult[0]?.count || 0);

    // Execute main query
    const baseQuery = db.select().from(crmCompanies);
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
    console.error('[crm] List companies error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crm/companies
 * Create a new company
 */
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Get user ID for audit fields
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await db.insert(crmCompanies).values({
      name: body.name as string,
      address1: body.address1 || null,
      address2: body.address2 || null,
      city: body.city || null,
      state: body.state || null,
      postalCode: body.postalCode || null,
      country: body.country || null,
      address: body.address || null,
      website: body.website || null,
      companyPhone: body.companyPhone || null,
      companyEmail: body.companyEmail || null,
      numEmployees: body.numEmployees || null,
      estimatedRevenue: body.estimatedRevenue || null,
      createdByUserId: userId,
      lastUpdatedByUserId: userId,
    }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('[crm] Create company error:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}

