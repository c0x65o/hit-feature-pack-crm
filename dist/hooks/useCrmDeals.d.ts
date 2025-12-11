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
};
export {};
//# sourceMappingURL=useCrmDeals.d.ts.map