/**
 * @hit/feature-pack-crm
 *
 * CRM feature pack with contacts, companies, deals, activities, LLM integration, RBAC, webhooks, and data export.
 *
 * Components are exported individually for optimal tree-shaking.
 * When used with the route loader system, only the requested component is bundled.
 */
export { Dashboard, DashboardPage, ContactList, ContactListPage, ContactDetail, ContactDetailPage, ContactEdit, ContactEditPage, CompanyList, CompanyListPage, CompanyDetail, CompanyDetailPage, CompanyEdit, CompanyEditPage, DealList, DealListPage, DealDetail, DealDetailPage, DealEdit, DealEditPage, ActivityList, ActivityListPage, } from './pages/index';
export * from './components/index';
export * from './hooks/index';
export { navContributions as nav } from './nav';
export { crmContacts, crmCompanies, crmDeals, crmActivities, crmPersonalNotes, crmPipelineStages, crmWebhookConfigs, crmApiKeys, crmOpenaiKeys, type CrmContact, type CrmCompany, type CrmDeal, type CrmActivity, type CrmPersonalNote, type CrmPipelineStage, type CrmWebhookConfig, type CrmApiKey, type CrmOpenaiKey, type InsertCrmContact, type InsertCrmCompany, type InsertCrmDeal, type InsertCrmActivity, type InsertCrmPersonalNote, type InsertCrmPipelineStage, type InsertCrmWebhookConfig, type InsertCrmApiKey, type InsertCrmOpenaiKey, } from './schema/crm';
export { parseActivityText } from './services/openai';
export * from './services/rbac';
export * from './services/webhooks';
//# sourceMappingURL=index.d.ts.map