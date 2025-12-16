import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/crm/contacts
 * List all contacts
 */
export declare function GET(request: NextRequest): Promise<NextResponse<{
    items: any;
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}> | NextResponse<{
    error: string;
}>>;
/**
 * POST /api/crm/contacts
 * Create a new contact
 */
export declare function POST(request: NextRequest): Promise<NextResponse<any>>;
//# sourceMappingURL=contacts.d.ts.map