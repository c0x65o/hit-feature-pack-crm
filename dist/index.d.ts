/**
 * @hit/feature-pack-crm
 *
 * CRM feature pack with contacts, companies, deals, activities, LLM integration, RBAC, webhooks, and data export.
 *
 * Components are exported individually for optimal tree-shaking.
 * When used with the route loader system, only the requested component is bundled.
 */
export { Dashboard, DashboardPage, ContactList, ContactListPage, ContactDetail, ContactDetailPage, ContactEdit, ContactEditPage, CompanyList, CompanyListPage, CompanyDetail, CompanyDetailPage, CompanyEdit, CompanyEditPage, DealList, DealListPage, DealDetail, DealDetailPage, DealEdit, DealEditPage, ActivityList, ActivityListPage, ActivityEdit, ActivityEditPage, PipelineStageManage, PipelineStageManagePage, } from './pages/index';
export * from './components/index';
export * from './hooks/index';
export { navContributions as nav } from './nav';
export { crmContacts, crmCompanies, crmDeals, crmActivities, crmPipelineStages, type CrmContact, type CrmCompany, type CrmDeal, type CrmActivity, type CrmPipelineStage, type InsertCrmContact, type InsertCrmCompany, type InsertCrmDeal, type InsertCrmActivity, type InsertCrmPipelineStage, DEFAULT_CRM_PIPELINE_STAGES, } from './schema/crm';
export { parseActivityText } from './services/openai';
export * from './services/rbac';
//# sourceMappingURL=index.d.ts.map