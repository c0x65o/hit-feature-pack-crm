// src/server/api/activities-id.ts
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmActivities } from '@/lib/feature-pack-schemas';
import { eq } from 'drizzle-orm';
import { getUserId } from '../auth';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
function isUuid(v) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}
function extractId(request) {
    const url = new URL(request.url);
    const parts = url.pathname.split('/');
    // /api/crm/activities/{id} -> id is last part
    const raw = parts[parts.length - 1] || null;
    return raw ? decodeURIComponent(raw) : null;
}
/**
 * GET /api/crm/activities/[id]
 */
export async function GET(request) {
    try {
        const id = extractId(request);
        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }
        if (!isUuid(id)) {
            return NextResponse.json({ error: 'Invalid id. Activity id must be a UUID. Use GET /api/crm/activities?search=... to find the id.' }, { status: 400 });
        }
        const db = getDb();
        const [activity] = await db
            .select()
            .from(crmActivities)
            .where(eq(crmActivities.id, id));
        if (!activity) {
            return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
        }
        return NextResponse.json(activity);
    }
    catch (error) {
        console.error('[crm] Get activity error:', error);
        return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
    }
}
/**
 * PUT /api/crm/activities/[id]
 */
export async function PUT(request) {
    try {
        const userId = getUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const id = extractId(request);
        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }
        if (!isUuid(id)) {
            return NextResponse.json({ error: 'Invalid id. Activity id must be a UUID. Use GET /api/crm/activities?search=... to find the id.' }, { status: 400 });
        }
        const body = await request.json();
        const db = getDb();
        const updateData = {
            rawNoteText: body?.rawNoteText ?? undefined,
            relatedContactId: body?.relatedContactId ?? undefined,
            relatedDealId: body?.relatedDealId ?? undefined,
            activityType: body?.activityType ?? undefined,
            taskDueDate: body?.taskDueDate ?? undefined,
            taskDescription: body?.taskDescription ?? undefined,
            lastUpdatedByUserId: userId,
            lastUpdatedOnTimestamp: new Date(),
        };
        for (const k of Object.keys(updateData))
            if (updateData[k] === undefined)
                delete updateData[k];
        if (body.taskDueDate) {
            updateData.taskDueDate = new Date(body.taskDueDate);
        }
        const [activity] = await db
            .update(crmActivities)
            .set(updateData)
            .where(eq(crmActivities.id, id))
            .returning();
        if (!activity) {
            return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
        }
        return NextResponse.json(activity);
    }
    catch (error) {
        console.error('[crm] Update activity error:', error);
        return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 });
    }
}
/**
 * DELETE /api/crm/activities/[id]
 */
export async function DELETE(request) {
    try {
        const id = extractId(request);
        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }
        if (!isUuid(id)) {
            return NextResponse.json({ error: 'Invalid id. Activity id must be a UUID.' }, { status: 400 });
        }
        const db = getDb();
        const [activity] = await db
            .delete(crmActivities)
            .where(eq(crmActivities.id, id))
            .returning();
        if (!activity) {
            return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    }
    catch (error) {
        console.error('[crm] Delete activity error:', error);
        return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 });
    }
}
//# sourceMappingURL=activities-id.js.map