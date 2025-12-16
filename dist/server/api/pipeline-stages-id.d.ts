import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/crm/pipeline-stages/[id]
 * Get a single pipeline stage by ID
 */
export declare function GET(request: NextRequest): Promise<NextResponse<any>>;
/**
 * PUT /api/crm/pipeline-stages/[id]
 * Update a pipeline stage
 * Code is identity and cannot be changed. Name can be updated.
 */
export declare function PUT(request: NextRequest): Promise<NextResponse<any>>;
/**
 * DELETE /api/crm/pipeline-stages/[id]
 * Delete a pipeline stage
 * Cannot delete if isSystem = true or if deals exist in this stage
 */
export declare function DELETE(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    deleted: any;
}> | NextResponse<{
    error: any;
}>>;
//# sourceMappingURL=pipeline-stages-id.d.ts.map