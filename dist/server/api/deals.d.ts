import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/crm/deals
 * List all deals
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
 * POST /api/crm/deals
 * Create a new deal
 */
export declare function POST(request: NextRequest): Promise<NextResponse<any>>;
//# sourceMappingURL=deals.d.ts.map