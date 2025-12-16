import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * PUT /api/crm/pipeline-stages/reorder
 * Reorder pipeline stages by providing an array of { id, order } objects
 */
export declare function PUT(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    updated: number;
    stages: any;
}> | NextResponse<{
    error: any;
}>>;
//# sourceMappingURL=pipeline-stages-reorder.d.ts.map