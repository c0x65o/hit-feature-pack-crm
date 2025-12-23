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
export declare const DEFAULT_CRM_PIPELINE_STAGES: readonly [{
    readonly name: "Lead";
    readonly order: 0;
    readonly color: "#6366f1";
}, {
    readonly name: "Qualified";
    readonly order: 1;
    readonly color: "#8b5cf6";
}, {
    readonly name: "Proposal";
    readonly order: 2;
    readonly color: "#ec4899";
}, {
    readonly name: "Negotiation";
    readonly order: 3;
    readonly color: "#f59e0b";
}, {
    readonly name: "Closed Won";
    readonly order: 4;
    readonly color: "#10b981";
}, {
    readonly name: "Closed Lost";
    readonly order: 5;
    readonly color: "#ef4444";
}];
export { parseActivityText } from './services/openai';
export * from './services/rbac';
//# sourceMappingURL=index.d.ts.map