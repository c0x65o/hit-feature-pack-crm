import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/crm/data-export
 * Bulk data export (requires API key authentication)
 */
export declare function GET(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    contacts: any;
    companies: any;
    deals: any;
    activities: any;
    exportedAt: string;
    customerId: string;
}>>;
//# sourceMappingURL=data-export.d.ts.map