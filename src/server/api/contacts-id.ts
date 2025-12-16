// src/server/api/contacts-id.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmContacts } from '@/lib/feature-pack-schemas';
import { eq, and } from 'drizzle-orm';
import { getUserId } from '../auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function extractId(request: NextRequest): string | null {
  const url = new URL(request.url);
  const parts = url.pathname.split('/');
  // /api/crm/contacts/{id} -> id is last part
  return parts[parts.length - 1] || null;
}

/**
 * GET /api/crm/contacts/[id]
 */
export async function GET(request: NextRequest) {
  try {
    const id = extractId(request);
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
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
  } catch (error) {
    console.error('[crm] Get contact error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/crm/contacts/[id]
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

    const [contact] = await db
      .update(crmContacts)
      .set({
        ...body,
        lastUpdatedByUserId: userId,
        lastUpdatedOnTimestamp: new Date(),
      })
      .where(eq(crmContacts.id, id))
      .returning();

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error('[crm] Update contact error:', error);
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/crm/contacts/[id]
 */
export async function DELETE(request: NextRequest) {
  try {
    const id = extractId(request);
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
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
  } catch (error) {
    console.error('[crm] Delete contact error:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}

