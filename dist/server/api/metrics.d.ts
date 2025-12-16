import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/crm/metrics
 * Get CRM metrics including counts and weekly deals data
 */
export declare function GET(request: NextRequest): Promise<NextResponse<{
    totals: {
        companies: number;
        contacts: number;
        deals: number;
        leads: number;
        opportunities: number;
        accounts: number;
        activities: number;
    };
    pipeline: {
        totalValue: number;
        wonValue: number;
    };
    dealsWeekly: {
        week: string;
        count: number;
        totalAmount: number;
    }[];
    leads: {
        byStatus: never[];
        recentConversions: number;
    };
    opportunities: {
        byStage: never[];
    };
    activities: {
        byStatus: never[];
    };
}> | NextResponse<{
    error: string;
}>>;
//# sourceMappingURL=metrics.d.ts.map