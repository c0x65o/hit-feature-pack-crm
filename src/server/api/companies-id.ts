// src/server/api/companies-id.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmCompanies } from '@/lib/feature-pack-schemas';
import { eq } from 'drizzle-orm';
import { getUserId } from '../auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function extractId(request: NextRequest): string | null {
  const url = new URL(request.url);
  const parts = url.pathname.split('/');
  // /api/crm/companies/{id} -> id is last part
  return parts[parts.length - 1] || null;
}

/**
 * GET /api/crm/companies/[id]
 */
export async function GET(request: NextRequest) {
  try {
    const id = extractId(request);
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
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
  } catch (error) {
    console.error('[crm] Get company error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/crm/companies/[id]
 */
export async function PUT(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = extractId(request);
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const body = await request.json();
    const db = getDb();

    const [company] = await db
      .update(crmCompanies)
      .set({
        ...body,
        lastUpdatedByUserId: userId,
        lastUpdatedOnTimestamp: new Date(),
      })
      .where(eq(crmCompanies.id, id))
      .returning();

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('[crm] Update company error:', error);
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/crm/companies/[id]
 */
export async function DELETE(request: NextRequest) {
  try {
    const id = extractId(request);
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
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
  } catch (error) {
    console.error('[crm] Delete company error:', error);
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    );
  }
}

