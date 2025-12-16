// src/server/api/data-export.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crmContacts, crmCompanies, crmDeals, crmActivities, crmApiKeys } from '@/lib/feature-pack-schemas';
import { eq, sql } from 'drizzle-orm';
import * as crypto from 'node:crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Authenticate API key from request
 */
async function authenticateApiKey(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const apiKey = authHeader.slice(7);
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

  const db = getDb();
  const [apiKeyRecord] = await db
    .select()
    .from(crmApiKeys)
    .where(eq(crmApiKeys.keyHash, keyHash));

  if (!apiKeyRecord || !apiKeyRecord.isActive) {
    return null;
  }

  // Check expiration
  if (apiKeyRecord.expiresAt && new Date(apiKeyRecord.expiresAt) < new Date()) {
    return null;
  }

  // Update last used timestamp
  await db
    .update(crmApiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(crmApiKeys.id, apiKeyRecord.id));

  return apiKeyRecord.customerId || apiKeyRecord.userId || null;
}

/**
 * GET /api/crm/data-export
 * Bulk data export (requires API key authentication)
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate via API key
    const customerId = await authenticateApiKey(request);
    if (!customerId) {
      return NextResponse.json(
        { error: 'Unauthorized - valid API key required' },
        { status: 401 }
      );
    }

    const db = getDb();
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    // Export all CRM data
    const [contacts, companies, deals, activities] = await Promise.all([
      db.select().from(crmContacts),
      db.select().from(crmCompanies),
      db.select().from(crmDeals),
      db.select().from(crmActivities),
    ]);

    const exportData = {
      contacts,
      companies,
      deals,
      activities,
      exportedAt: new Date().toISOString(),
      customerId,
    };

    if (format === 'csv') {
      // Simple CSV export (would need proper CSV library for production)
      return NextResponse.json(
        { error: 'CSV format not yet implemented' },
        { status: 501 }
      );
    }

    return NextResponse.json(exportData);
  } catch (error) {
    console.error('[crm] Data export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

