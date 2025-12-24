// src/server/api/contacts-id.ts
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmContacts } from '@/lib/feature-pack-schemas';
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
    // /api/crm/contacts/{id} -> id is last part
    const raw = parts[parts.length - 1] || null;
    return raw ? decodeURIComponent(raw) : null;
}
/**
 * GET /api/crm/contacts/[id]
 */
export async function GET(request) {
    try {
        const id = extractId(request);
        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }
        if (!isUuid(id)) {
            return NextResponse.json({ error: 'Invalid id. Contact id must be a UUID. Use GET /api/crm/contacts?search=... to find the id.' }, { status: 400 });
        }
        const db = getDb();
        const [contact] = await db
            .select()
            .from(crmContacts)
            .where(eq(crmContacts.id, id));
        if (!contact) {
            return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
        }
        return NextResponse.json(contact);
    }
    catch (error) {
        console.error('[crm] Get contact error:', error);
        return NextResponse.json({ error: 'Failed to fetch contact' }, { status: 500 });
    }
}
/**
 * PUT /api/crm/contacts/[id]
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
            return NextResponse.json({ error: 'Invalid id. Contact id must be a UUID. Use GET /api/crm/contacts?search=... to find the id.' }, { status: 400 });
        }
        const body = await request.json();
        const db = getDb();
        // Whitelist common editable fields. (Avoid overwriting system/audit fields.)
        const patch = {
            firstName: body?.firstName ?? undefined,
            lastName: body?.lastName ?? undefined,
            name: body?.name ?? undefined,
            email: body?.email ?? undefined,
            phone: body?.phone ?? undefined,
            title: body?.title ?? undefined,
            companyId: body?.companyId ?? undefined,
            notes: body?.notes ?? undefined,
        };
        for (const k of Object.keys(patch))
            if (patch[k] === undefined)
                delete patch[k];
        const [contact] = await db
            .update(crmContacts)
            .set({
            ...patch,
            lastUpdatedByUserId: userId,
            lastUpdatedOnTimestamp: new Date(),
        })
            .where(eq(crmContacts.id, id))
            .returning();
        if (!contact) {
            return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
        }
        return NextResponse.json(contact);
    }
    catch (error) {
        console.error('[crm] Update contact error:', error);
        return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
    }
}
/**
 * DELETE /api/crm/contacts/[id]
 */
export async function DELETE(request) {
    try {
        const id = extractId(request);
        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }
        if (!isUuid(id)) {
            return NextResponse.json({ error: 'Invalid id. Contact id must be a UUID.' }, { status: 400 });
        }
        const db = getDb();
        const [contact] = await db
            .delete(crmContacts)
            .where(eq(crmContacts.id, id))
            .returning();
        if (!contact) {
            return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    }
    catch (error) {
        console.error('[crm] Delete contact error:', error);
        return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
    }
}
//# sourceMappingURL=contacts-id.js.map