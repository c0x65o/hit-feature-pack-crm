/**
 * @hit/feature-pack-crm
 *
 * CRM feature pack with contacts, companies, deals, activities, LLM integration, RBAC, webhooks, and data export.
 *
 * Components are exported individually for optimal tree-shaking.
 * When used with the route loader system, only the requested component is bundled.
 */

// Pages - exported individually for tree-shaking
export {
  Dashboard,
  DashboardPage,
  ContactList,
  ContactListPage,
  ContactDetail,
  ContactDetailPage,
  ContactEdit,
  ContactEditPage,
  CompanyList,
  CompanyListPage,
  CompanyDetail,
  CompanyDetailPage,
  CompanyEdit,
  CompanyEditPage,
  DealList,
  DealListPage,
  DealDetail,
  DealDetailPage,
  DealEdit,
  DealEditPage,
  ActivityList,
  ActivityListPage,
  ActivityEdit,
  ActivityEditPage,
  PipelineStageManage,
  PipelineStageManagePage,
} from './pages/index';

// Components - exported individually for tree-shaking
export * from './components/index';

// Hooks - exported individually for tree-shaking
export * from './hooks/index';

// Navigation config
export { navContributions as nav } from './nav';

// Schema exports - MOVED to @hit/feature-pack-crm/schema to avoid bundling drizzle-orm in client
// Don't import from schema file at all - it pulls in drizzle-orm

// Default pipeline stages - defined inline to avoid pulling in schema file
export const DEFAULT_CRM_PIPELINE_STAGES = [
  { name: 'Lead', order: 0, color: '#6366f1' },
  { name: 'Qualified', order: 1, color: '#8b5cf6' },
  { name: 'Proposal', order: 2, color: '#ec4899' },
  { name: 'Negotiation', order: 3, color: '#f59e0b' },
  { name: 'Closed Won', order: 4, color: '#10b981' },
  { name: 'Closed Lost', order: 5, color: '#ef4444' },
] as const;

// Services
export { parseActivityText } from './services/openai';
export * from './services/rbac';

