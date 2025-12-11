# CRM Feature Pack - Quick Implementation Checklist

## 🚀 Quick Start Integration

- [ ] Build feature pack: `cd hit-feature-packs/hit-feature-pack-crm && npm install && npm run build`
- [ ] Add to hit-dashboard: `cd applications/hit-dashboard && npm install @hit/feature-pack-crm@file:../../hit-feature-packs/hit-feature-pack-crm`
- [ ] Run `hit run` to auto-generate routes and schemas
- [ ] Create database migrations: `npx drizzle-kit generate && npx drizzle-kit push`
- [ ] Seed default pipeline stages (see IMPLEMENTATION_REMAINING.md)

## 📡 API Endpoints (Priority Order)

### Critical (Core Functionality)
- [ ] `GET/POST/PUT/DELETE /api/crm/contacts` - Complete CRUD
- [ ] `GET/POST/PUT/DELETE /api/crm/companies` - Complete CRUD  
- [ ] `GET/POST/PUT/DELETE /api/crm/deals` - Complete CRUD + webhook on stage change
- [ ] `GET/POST/PUT/DELETE /api/crm/activities` - Complete CRUD + LLM parsing
- [ ] `GET /api/crm/search` - Global search endpoint

### Important (User Features)
- [ ] `GET/POST /api/crm/personal-notes` - User-scoped notes
- [ ] `GET /api/crm/pipeline-stages` - List stages
- [ ] `POST /api/crm/deals/reassign` - Reassign deals

### Reporting (Analytics)
- [ ] `GET /api/crm/reports/close-rate`
- [ ] `GET /api/crm/reports/acv`
- [ ] `GET /api/crm/reports/sales-cycle`
- [ ] `GET /api/crm/reports/pipeline-health`

### Integration (Advanced)
- [ ] `GET /api/crm/data-export` - Bulk export with API key auth
- [ ] `GET/POST/PUT/DELETE /api/crm/webhooks` - Webhook management

## 🎨 Frontend Components

### Pages (Complete Forms & Details)
- [ ] ContactEdit - Full form with validation
- [ ] ContactDetail - Add personal notes, related deals, activity timeline
- [ ] CompanyEdit - Full form with qualification fields
- [ ] CompanyDetail - Add related contacts/deals
- [ ] DealEdit - Full form with stage selection, owner assignment
- [ ] DealDetail - Add stage change UI, related activities
- [ ] ActivityEdit/Create - Rich text editor, LLM parsing UI, manual override

### Component Enhancements
- [ ] KanbanView - Add drag-and-drop library integration
- [ ] GlobalSearch - Add keyboard navigation, recent searches
- [ ] TaskWidget - Add mark complete action, priority filter
- [ ] ActivityFeed - Add infinite scroll, type filtering

### New Components
- [ ] PipelineStageSelector - Dropdown component
- [ ] ContactSelector - Searchable dropdown
- [ ] CompanySelector - Searchable dropdown
- [ ] UserSelector - For owner assignment
- [ ] RichTextEditor - For activity notes (if not in UI kit)

## 🔧 Configuration & Setup

### Feature Flags (hit.yaml)
- [ ] Configure `pipeline_stages` (or leave empty for defaults)
- [ ] Set `openai_enabled: true` if using LLM
- [ ] Set `webhook_enabled: true` if using webhooks
- [ ] Configure `webhook_url` if needed

### Database Setup
- [ ] Create migration file with all tables
- [ ] Seed default pipeline stages
- [ ] Create indexes for performance
- [ ] Set up encryption for OpenAI keys (if enabled)

### Security Setup
- [ ] Configure API key generation for data export
- [ ] Set up webhook signature verification
- [ ] Configure rate limiting
- [ ] Set up audit logging

## ✅ Testing

### Unit Tests
- [ ] OpenAI service parsing
- [ ] RBAC permission checks
- [ ] Webhook delivery
- [ ] API endpoint RBAC enforcement

### Integration Tests
- [ ] Contact creation → webhook
- [ ] Deal stage change → webhook
- [ ] Activity creation → LLM parsing
- [ ] RBAC across all endpoints
- [ ] Data export authentication

### Manual Testing
- [ ] Create contact/company/deal
- [ ] Test Salesperson role restrictions
- [ ] Test Sales Manager full access
- [ ] Test LLM parsing on activities
- [ ] Test webhook delivery
- [ ] Test global search
- [ ] Test Kanban drag-and-drop
- [ ] Test reporting endpoints

## 📊 Priority Levels

### P0 - Must Have (Core Functionality)
- Contacts CRUD
- Companies CRUD
- Deals CRUD
- Activities CRUD
- Basic RBAC enforcement
- Dashboard widgets

### P1 - Should Have (User Experience)
- Global search
- Kanban view
- Personal notes
- Activity LLM parsing
- Basic reporting

### P2 - Nice to Have (Advanced Features)
- Advanced reporting
- Data export API
- Webhook management UI
- Custom pipeline stages
- Rich text editor

### P3 - Future Enhancements
- Email integration
- Activity reminders
- Duplicate detection
- Custom fields
- Multi-tenant support

## 🐛 Known Issues / TODOs

- [ ] Fix import paths in webhook service (use proper package imports)
- [ ] Complete user context extraction from JWT (see `lib/crm-utils.ts`)
- [ ] Add proper error handling in all API endpoints
- [ ] Add input validation/sanitization
- [ ] Add pagination to all list endpoints
- [ ] Add loading states to all components
- [ ] Add error boundaries in React components
- [ ] Add proper TypeScript types for all API responses
- [ ] Add unit tests for all services
- [ ] Add integration tests for critical flows

## 📝 Documentation Needed

- [ ] API documentation (OpenAPI spec)
- [ ] User guide
- [ ] Admin configuration guide
- [ ] Developer extension guide
- [ ] Migration guide (if migrating from old CRM)

---

**Estimated Time to Complete:**
- P0 (Core): ~2-3 days
- P1 (UX): ~2-3 days  
- P2 (Advanced): ~2-3 days
- Testing & Polish: ~1-2 days

**Total: ~7-11 days for full implementation**

