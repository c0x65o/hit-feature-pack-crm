import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/crm/reports/close-rate
 * Get close rate KPI
 */
export declare function GET(request: NextRequest): Promise<NextResponse<{
    closeRate: number;
    won: number;
    lost: number;
    total: number;
}> | NextResponse<{
    error: string;
}>>;
//# sourceMappingURL=reports-close-rate.d.ts.map