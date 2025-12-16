import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/crm/pipeline-stages
 * List all pipeline stages ordered by order field
 */
export declare function GET(request: NextRequest): Promise<NextResponse<{
    items: any;
}> | NextResponse<{
    error: string;
}>>;
/**
 * POST /api/crm/pipeline-stages
 * Create a new pipeline stage
 * Requires: code, name, order
 */
export declare function POST(request: NextRequest): Promise<NextResponse<any>>;
//# sourceMappingURL=pipeline-stages.d.ts.map