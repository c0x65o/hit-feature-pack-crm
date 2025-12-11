interface UseCrmContactsOptions {
    id?: string;
    page?: number;
    pageSize?: number;
    search?: string;
    companyId?: string;
}
export declare function useCrmContacts(options?: UseCrmContactsOptions): {
    data: any;
    loading: boolean;
    error: Error | null;
    createContact: (contact: any) => Promise<any>;
    updateContact: (id: string, contact: any) => Promise<any>;
};
export {};
//# sourceMappingURL=useCrmContacts.d.ts.map