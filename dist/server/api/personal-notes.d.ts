import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/crm/personal-notes
 * List personal notes scoped by user
 */
export declare function GET(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    items: any;
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}>>;
/**
 * POST /api/crm/personal-notes
 * Create a new personal note
 */
export declare function POST(request: NextRequest): Promise<NextResponse<any>>;
//# sourceMappingURL=personal-notes.d.ts.map