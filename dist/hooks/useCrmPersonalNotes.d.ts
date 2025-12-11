interface UseCrmPersonalNotesOptions {
    contactId?: string;
}
export declare function useCrmPersonalNotes(options?: UseCrmPersonalNotesOptions): {
    data: any[] | null;
    loading: boolean;
    error: Error | null;
    createNote: (note: any) => Promise<any>;
};
export {};
//# sourceMappingURL=useCrmPersonalNotes.d.ts.map