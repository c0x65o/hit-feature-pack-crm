import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/crm/contacts/[id]
 */
export declare function GET(request: NextRequest): Promise<NextResponse<any>>;
/**
 * PUT /api/crm/contacts/[id]
 */
export declare function PUT(request: NextRequest): Promise<NextResponse<any>>;
/**
 * DELETE /api/crm/contacts/[id]
 */
export declare function DELETE(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
}>>;
//# sourceMappingURL=contacts-id.d.ts.map