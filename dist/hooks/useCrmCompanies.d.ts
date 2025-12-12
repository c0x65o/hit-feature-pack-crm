interface UseCrmCompaniesOptions {
    id?: string;
    page?: number;
    pageSize?: number;
    search?: string;
}
export declare function useCrmCompanies(options?: UseCrmCompaniesOptions): {
    data: any;
    loading: boolean;
    error: Error | null;
    createCompany: (company: any) => Promise<any>;
    updateCompany: (id: string, company: any) => Promise<any>;
    deleteCompany: (id: string) => Promise<any>;
    refetch: () => Promise<void>;
};
export {};
//# sourceMappingURL=useCrmCompanies.d.ts.map