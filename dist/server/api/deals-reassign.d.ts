import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * POST /api/crm/deals/reassign
 * Reassign deals from inactive user to new owner
 */
export declare function POST(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
    reassignedCount: any;
    deals: any;
}>>;
//# sourceMappingURL=deals-reassign.d.ts.map