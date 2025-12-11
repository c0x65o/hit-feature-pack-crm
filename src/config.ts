/**
 * Configuration defaults for CRM feature pack
 */

export const configDefaults = {
  pipeline_stages: [] as Array<{
    name: string;
    order: number;
    is_closed_won: boolean;
    is_closed_lost: boolean;
  }>,
  openai_enabled: false,
  llm_activity_parsing: true,
  webhook_enabled: false,
  webhook_url: '',
  data_export_enabled: true,
};

export type CrmConfig = typeof configDefaults;

