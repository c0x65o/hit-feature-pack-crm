import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/crm/reports/pipeline-health
 * Get pipeline health by stage
 */
export declare function GET(request: NextRequest): Promise<NextResponse<{
    stages: any[];
}> | NextResponse<{
    error: string;
}>>;
//# sourceMappingURL=reports-pipeline-health.d.ts.map