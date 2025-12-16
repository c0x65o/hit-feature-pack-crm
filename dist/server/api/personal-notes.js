// src/server/api/personal-notes.ts
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmPersonalNotes } from '@/lib/feature-pack-schemas';
import { eq, desc, like, sql, and } from 'drizzle-orm';
import { getUserId } from '../auth';
// Required for Next.js App Router
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
/**
 * GET /api/crm/personal-notes
 * List personal notes scoped by user
 */
export async function GET(request) {
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
        // Filters
        const contactId = searchParams.get('contactId') || null;
        const search = searchParams.get('search') || '';
        // Build where conditions - always scope to current user
        const conditions = [eq(crmPersonalNotes.userId, userId)];
        if (contactId) {
            conditions.push(eq(crmPersonalNotes.contactId, contactId));
        }
        if (search) {
            conditions.push(like(crmPersonalNotes.noteText, `%${search}%`));
        }
        // Build where clause
        const whereClause = and(...conditions);
        // Get total count for pagination
        const countResult = await db
            .select({ count: sql `count(*)` })
            .from(crmPersonalNotes)
            .where(whereClause);
        const total = Number(countResult[0]?.count || 0);
        // Execute main query
        const items = await db
            .select()
            .from(crmPersonalNotes)
            .where(whereClause)
            .orderBy(desc(crmPersonalNotes.createdOnTimestamp))
            .limit(pageSize)
            .offset(offset);
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
        console.error('[crm] List personal notes error:', error);
        return NextResponse.json({ error: 'Failed to fetch personal notes' }, { status: 500 });
    }
}
/**
 * POST /api/crm/personal-notes
 * Create a new personal note
 */
export async function POST(request) {
    try {
        const userId = getUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const db = getDb();
        const body = await request.json();
        // Validate required fields
        if (!body.contactId) {
            return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
        }
        if (!body.noteText) {
            return NextResponse.json({ error: 'Note text is required' }, { status: 400 });
        }
        const result = await db.insert(crmPersonalNotes).values({
            contactId: body.contactId,
            userId: userId,
            noteText: body.noteText,
            createdByUserId: userId,
            lastUpdatedByUserId: userId,
        }).returning();
        return NextResponse.json(result[0], { status: 201 });
    }
    catch (error) {
        console.error('[crm] Create personal note error:', error);
        return NextResponse.json({ error: 'Failed to create personal note' }, { status: 500 });
    }
}
//# sourceMappingURL=personal-notes.js.map