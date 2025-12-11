interface MetricsData {
    totals: {
        leads: number;
        opportunities: number;
        contacts: number;
        accounts: number;
        activities: number;
    };
    pipeline: {
        totalValue: number;
        wonValue: number;
    };
    leads: {
        byStatus: Array<{
            status: string;
            count: number;
        }>;
        recentConversions: number;
    };
    opportunities: {
        byStage: Array<{
            stage: string;
            count: number;
            totalAmount: number;
        }>;
    };
    activities: {
        byType: Array<{
            type: string;
            count: number;
        }>;
        byStatus: Array<{
            status: string;
            count: number;
        }>;
    };
}
export declare function useCrmMetrics(): {
    data: MetricsData | null;
    loading: boolean;
    error: Error | null;
};
export {};
//# sourceMappingURL=useCrmMetrics.d.ts.map