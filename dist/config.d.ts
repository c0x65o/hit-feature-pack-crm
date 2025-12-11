/**
 * Configuration defaults for CRM feature pack
 */
export declare const configDefaults: {
    pipeline_stages: Array<{
        name: string;
        order: number;
        is_closed_won: boolean;
        is_closed_lost: boolean;
    }>;
    openai_enabled: boolean;
    llm_activity_parsing: boolean;
    webhook_enabled: boolean;
    webhook_url: string;
    data_export_enabled: boolean;
};
export type CrmConfig = typeof configDefaults;
//# sourceMappingURL=config.d.ts.map