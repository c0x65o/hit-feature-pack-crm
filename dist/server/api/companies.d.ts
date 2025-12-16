import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/crm/companies
 * List all companies
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
 * POST /api/crm/companies
 * Create a new company
 */
export declare function POST(request: NextRequest): Promise<NextResponse<any>>;
//# sourceMappingURL=companies.d.ts.map