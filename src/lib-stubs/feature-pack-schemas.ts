/**
 * Stub for @/lib/feature-pack-schemas
 * 
 * This is a type-only stub for feature pack compilation.
 * At runtime, the consuming application provides the actual implementation
 * which is auto-generated from feature pack schemas.
 * 
 * This stub re-exports from the local schema file for type checking.
 */

// Re-export from the actual schema file for type checking during build
export {
  crmContacts,
  crmCompanies,
  crmDeals,
  crmActivities,
  crmPipelineStages,
  type CrmContact,
  type CrmCompany,
  type CrmDeal,
  type CrmActivity,
  type CrmPipelineStage,
  type InsertCrmContact,
  type InsertCrmCompany,
  type InsertCrmDeal,
  type InsertCrmActivity,
  type InsertCrmPipelineStage,
  DEFAULT_CRM_PIPELINE_STAGES,
} from '../schema/crm';
