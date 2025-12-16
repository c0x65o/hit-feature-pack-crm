import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/crm/reports/sales-cycle
 * Get average sales cycle length KPI
 */
export declare function GET(request: NextRequest): Promise<NextResponse<{
    averageDays: number;
    count: number;
}> | NextResponse<{
    error: string;
}>>;
//# sourceMappingURL=reports-sales-cycle.d.ts.map