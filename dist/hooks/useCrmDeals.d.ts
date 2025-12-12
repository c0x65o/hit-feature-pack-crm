interface UseCrmDealsOptions {
    id?: string;
    page?: number;
    pageSize?: number;
    filter?: string;
    search?: string;
}
export declare function useCrmDeals(options?: UseCrmDealsOptions): {
    data: any;
    loading: boolean;
    error: Error | null;
    createDeal: (deal: any) => Promise<any>;
    updateDeal: (id: string, deal: any) => Promise<any>;
    deleteDeal: (id: string) => Promise<any>;
    refetch: () => Promise<void>;
};
export {};
//# sourceMappingURL=useCrmDeals.d.ts.map