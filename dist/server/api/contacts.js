// src/server/api/contacts.ts
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmContacts } from '@/lib/feature-pack-schemas';
import { eq, desc, asc, like, sql, and, or } from 'drizzle-orm';
import { getUserId } from '../auth';
// Required for Next.js App Router
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
/**
 * GET /api/crm/contacts
 * List all contacts
 */
export async function GET(request) {
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
        const companyId = searchParams.get('companyId') || null;
        // Build where conditions
        const conditions = [];
        if (search) {
            conditions.push(or(like(crmContacts.name, `%${search}%`), like(crmContacts.email, `%${search}%`), like(crmContacts.phone, `%${search}%`)));
        }
        if (companyId) {
            conditions.push(eq(crmContacts.companyId, companyId));
        }
        // Apply sorting
        const sortColumns = {
            id: crmContacts.id,
            name: crmContacts.name,
            email: crmContacts.email,
            createdOnTimestamp: crmContacts.createdOnTimestamp,
            lastUpdatedOnTimestamp: crmContacts.lastUpdatedOnTimestamp,
        };
        const orderCol = sortColumns[sortBy] ?? crmContacts.createdOnTimestamp;
        const orderDirection = sortOrder === 'asc' ? asc(orderCol) : desc(orderCol);
        // Build where clause
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
        // Get total count for pagination
        const countQuery = db.select({ count: sql `count(*)` }).from(crmContacts);
        const countResult = whereClause
            ? await countQuery.where(whereClause)
            : await countQuery;
        const total = Number(countResult[0]?.count || 0);
        // Execute main query
        const baseQuery = db.select().from(crmContacts);
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
    }
    catch (error) {
        console.error('[crm] List contacts error:', error);
        return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
    }
}
/**
 * POST /api/crm/contacts
 * Create a new contact
 */
export async function POST(request) {
    try {
        const db = getDb();
        const body = await request.json();
        // Validate required fields
        if (!body.name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }
        // Get user ID for audit fields
        const userId = getUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const result = await db.insert(crmContacts).values({
            name: body.name,
            title: body.title || null,
            companyId: body.companyId || null,
            address1: body.address1 || null,
            address2: body.address2 || null,
            city: body.city || null,
            state: body.state || null,
            postalCode: body.postalCode || null,
            country: body.country || null,
            phone: body.phone || null,
            email: body.email || null,
            createdByUserId: userId,
            lastUpdatedByUserId: userId,
        }).returning();
        return NextResponse.json(result[0], { status: 201 });
    }
    catch (error) {
        console.error('[crm] Create contact error:', error);
        return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
    }
}
//# sourceMappingURL=contacts.js.map