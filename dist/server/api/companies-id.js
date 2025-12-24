// src/server/api/companies-id.ts
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmCompanies } from '@/lib/feature-pack-schemas';
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
    // /api/crm/companies/{id} -> id is last part
    const raw = parts[parts.length - 1] || null;
    return raw ? decodeURIComponent(raw) : null;
}
/**
 * GET /api/crm/companies/[id]
 */
export async function GET(request) {
    try {
        const id = extractId(request);
        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }
        if (!isUuid(id)) {
            return NextResponse.json({ error: 'Invalid id. Company id must be a UUID. Use GET /api/crm/companies?search=... to find the id.' }, { status: 400 });
        }
        const db = getDb();
        const [company] = await db
            .select()
            .from(crmCompanies)
            .where(eq(crmCompanies.id, id));
        if (!company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }
        return NextResponse.json(company);
    }
    catch (error) {
        console.error('[crm] Get company error:', error);
        return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
    }
}
/**
 * PUT /api/crm/companies/[id]
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
            return NextResponse.json({ error: 'Invalid id. Company id must be a UUID. Use GET /api/crm/companies?search=... to find the id.' }, { status: 400 });
        }
        const body = await request.json();
        const db = getDb();
        // Whitelist fields to prevent accidental updates to system/audit fields.
        const patch = {
            name: body?.name ?? undefined,
            address1: body?.address1 ?? undefined,
            address2: body?.address2 ?? undefined,
            city: body?.city ?? undefined,
            state: body?.state ?? undefined,
            postalCode: body?.postalCode ?? undefined,
            country: body?.country ?? undefined,
            address: body?.address ?? undefined,
            website: body?.website ?? undefined,
            companyPhone: body?.companyPhone ?? undefined,
            companyEmail: body?.companyEmail ?? undefined,
            numEmployees: body?.numEmployees ?? undefined,
            estimatedRevenue: body?.estimatedRevenue ?? undefined,
        };
        // Remove undefined keys so drizzle doesn't overwrite with null.
        for (const k of Object.keys(patch))
            if (patch[k] === undefined)
                delete patch[k];
        const [company] = await db
            .update(crmCompanies)
            .set({
            ...patch,
            lastUpdatedByUserId: userId,
            lastUpdatedOnTimestamp: new Date(),
        })
            .where(eq(crmCompanies.id, id))
            .returning();
        if (!company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }
        return NextResponse.json(company);
    }
    catch (error) {
        console.error('[crm] Update company error:', error);
        return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
    }
}
/**
 * DELETE /api/crm/companies/[id]
 */
export async function DELETE(request) {
    try {
        const id = extractId(request);
        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }
        if (!isUuid(id)) {
            return NextResponse.json({ error: 'Invalid id. Company id must be a UUID.' }, { status: 400 });
        }
        const db = getDb();
        const [company] = await db
            .delete(crmCompanies)
            .where(eq(crmCompanies.id, id))
            .returning();
        if (!company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    }
    catch (error) {
        console.error('[crm] Delete company error:', error);
        return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 });
    }
}
//# sourceMappingURL=companies-id.js.map