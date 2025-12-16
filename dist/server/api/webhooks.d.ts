import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/crm/webhooks
 * List webhook configurations
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
 * POST /api/crm/webhooks
 * Create a new webhook configuration
 */
export declare function POST(request: NextRequest): Promise<NextResponse<any>>;
/**
 * PUT /api/crm/webhooks
 * Update a webhook configuration (requires id in body)
 */
export declare function PUT(request: NextRequest): Promise<NextResponse<any>>;
/**
 * DELETE /api/crm/webhooks
 * Delete a webhook configuration (requires id in query params)
 */
export declare function DELETE(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
}>>;
//# sourceMappingURL=webhooks.d.ts.map