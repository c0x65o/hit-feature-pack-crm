import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/crm/companies/[id]
 */
export declare function GET(request: NextRequest): Promise<NextResponse<any>>;
/**
 * PUT /api/crm/companies/[id]
 */
export declare function PUT(request: NextRequest): Promise<NextResponse<any>>;
/**
 * DELETE /api/crm/companies/[id]
 */
export declare function DELETE(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
}>>;
//# sourceMappingURL=companies-id.d.ts.map