interface UseCrmActivitiesOptions {
    id?: string;
    contactId?: string;
    dealId?: string;
    page?: number;
    pageSize?: number;
    limit?: number;
    filter?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare function useCrmActivities(options?: UseCrmActivitiesOptions): {
    data: any[] | null;
    loading: boolean;
    error: Error | null;
    createActivity: (activity: any) => Promise<any>;
    updateActivity: (id: string, activity: any) => Promise<any>;
};
export {};
//# sourceMappingURL=useCrmActivities.d.ts.map