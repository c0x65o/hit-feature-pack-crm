import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/crm/reports/acv
 * Get average contract value (ACV) KPI
 */
export declare function GET(request: NextRequest): Promise<NextResponse<{
    acv: number;
    count: number;
    total: number;
}> | NextResponse<{
    error: string;
}>>;
//# sourceMappingURL=reports-acv.d.ts.map