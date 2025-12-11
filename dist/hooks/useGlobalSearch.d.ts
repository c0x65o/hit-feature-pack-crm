interface SearchResult {
    id: string;
    type: 'contact' | 'company' | 'deal';
    name: string;
    subtitle?: string;
    badge?: string;
}
export declare function useGlobalSearch(query: string): {
    data: SearchResult[] | null;
    loading: boolean;
};
export {};
//# sourceMappingURL=useGlobalSearch.d.ts.map