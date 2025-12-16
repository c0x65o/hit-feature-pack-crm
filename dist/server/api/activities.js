// src/server/api/activities.ts
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmActivities } from '@/lib/feature-pack-schemas';
import { eq, desc, asc, like, sql, and } from 'drizzle-orm';
import { getUserId } from '../auth';
// Required for Next.js App Router
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
/**
 * GET /api/crm/activities
 * List all activities
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
        // Filters
        const search = searchParams.get('search') || '';
        const userId = searchParams.get('userId') || null;
        const relatedContactId = searchParams.get('relatedContactId') || null;
        const relatedDealId = searchParams.get('relatedDealId') || null;
        const activityType = searchParams.get('activityType') || null;
        // Build where conditions
        const conditions = [];
        if (search) {
            conditions.push(like(crmActivities.rawNoteText, `%${search}%`));
        }
        if (userId) {
            conditions.push(eq(crmActivities.userId, userId));
        }
        if (relatedContactId) {
            conditions.push(eq(crmActivities.relatedContactId, relatedContactId));
        }
        if (relatedDealId) {
            conditions.push(eq(crmActivities.relatedDealId, relatedDealId));
        }
        if (activityType) {
            conditions.push(eq(crmActivities.activityType, activityType));
        }
        // Apply sorting
        const sortColumns = {
            id: crmActivities.id,
            createdOnTimestamp: crmActivities.createdOnTimestamp,
            taskDueDate: crmActivities.taskDueDate,
        };
        const orderCol = sortColumns[sortBy] ?? crmActivities.createdOnTimestamp;
        const orderDirection = sortOrder === 'asc' ? asc(orderCol) : desc(orderCol);
        // Build where clause
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
        // Get total count for pagination
        const countQuery = db.select({ count: sql `count(*)` }).from(crmActivities);
        const countResult = whereClause
            ? await countQuery.where(whereClause)
            : await countQuery;
        const total = Number(countResult[0]?.count || 0);
        // Execute main query
        const baseQuery = db.select().from(crmActivities);
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
        console.error('[crm] List activities error:', error);
        return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
    }
}
/**
 * POST /api/crm/activities
 * Create a new activity
 */
export async function POST(request) {
    try {
        const db = getDb();
        const body = await request.json();
        // Validate required fields
        if (!body.rawNoteText) {
            return NextResponse.json({ error: 'Raw note text is required' }, { status: 400 });
        }
        // Get user ID for audit fields
        const userId = getUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const result = await db.insert(crmActivities).values({
            rawNoteText: body.rawNoteText,
            relatedContactId: body.relatedContactId || null,
            relatedDealId: body.relatedDealId || null,
            userId: userId,
            activityType: body.activityType || null,
            taskDueDate: body.taskDueDate ? new Date(body.taskDueDate) : null,
            taskDescription: body.taskDescription || null,
            createdByUserId: userId,
            lastUpdatedByUserId: userId,
        }).returning();
        return NextResponse.json(result[0], { status: 201 });
    }
    catch (error) {
        console.error('[crm] Create activity error:', error);
        return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
    }
}
//# sourceMappingURL=activities.js.map