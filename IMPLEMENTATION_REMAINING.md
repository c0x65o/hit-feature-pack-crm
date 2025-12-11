# CRM Feature Pack - Remaining Implementation

This document outlines what remains to be implemented to complete the CRM feature pack integration.

## Table of Contents
1. [API Endpoints](#api-endpoints)
2. [Frontend Components](#frontend-components)
3. [Integration Steps](#integration-steps)
4. [Feature Flags](#feature-flags)
5. [Database Migrations](#database-migrations)
6. [Testing & Validation](#testing--validation)

---

## API Endpoints

### Core CRUD Endpoints

#### ✅ Completed
- `GET/POST /api/crm/contacts` - Basic structure created (see `contacts-new/route.ts`)

#### ❌ Remaining

**Contacts API** (`app/api/crm/contacts/`)
- [ ] `GET /api/crm/contacts/[id]` - Get single contact with RBAC
- [ ] `PUT /api/crm/contacts/[id]` - Update contact with RBAC
- [ ] `DELETE /api/crm/contacts/[id]` - Delete contact (Sales Manager only)
- [ ] Update existing `route.ts` to use new schema and RBAC

**Companies API** (`app/api/crm/companies/`)
- [ ] `GET /api/crm/companies` - List companies with RBAC (Salesperson: read-only all, Manager: full access)
- [ ] `POST /api/crm/companies` - Create company
- [ ] `GET /api/crm/companies/[id]` - Get single company
- [ ] `PUT /api/crm/companies/[id]` - Update company
- [ ] `DELETE /api/crm/companies/[id]` - Delete company (Sales Manager only)

**Deals API** (`app/api/crm/deals/`)
- [ ] `GET /api/crm/deals` - List deals with RBAC and filtering
- [ ] `POST /api/crm/deals` - Create deal (must set owner_user_id)
- [ ] `GET /api/crm/deals/[id]` - Get single deal
- [ ] `PUT /api/crm/deals/[id]` - Update deal (trigger webhook on pipeline_stage change to Closed_Won)
- [ ] `DELETE /api/crm/deals/[id]` - Delete deal (Sales Manager only)
- [ ] `POST /api/crm/deals/reassign` - Reassign deals from inactive user to new owner

**Activities API** (`app/api/crm/activities/`)
- [ ] `GET /api/crm/activities` - List activities with filtering (contactId, dealId, userId)
- [ ] `POST /api/crm/activities` - Create activity with LLM parsing:
  - Call `parseActivityText()` from `@hit/feature-pack-crm/services/openai`
  - Store parsed fields (activity_type, task_due_date, task_description)
  - Allow manual override of parsed fields
  - Auto-update `last_contacted_date` on related contact
- [ ] `GET /api/crm/activities/[id]` - Get single activity
- [ ] `PUT /api/crm/activities/[id]` - Update activity
- [ ] `DELETE /api/crm/activities/[id]` - Delete activity

**Personal Notes API** (`app/api/crm/personal-notes/`)
- [ ] `GET /api/crm/personal-notes` - List notes (scoped by current user_id)
- [ ] `POST /api/crm/personal-notes` - Create note (auto-set user_id from auth)

**Pipeline Stages API** (`app/api/crm/pipeline-stages/`)
- [ ] `GET /api/crm/pipeline-stages` - List all pipeline stages (ordered by `order` field)
- [ ] `POST /api/crm/pipeline-stages` - Create stage (Sales Manager only)
- [ ] `PUT /api/crm/pipeline-stages/[id]` - Update stage (Sales Manager only)
- [ ] `DELETE /api/crm/pipeline-stages/[id]` - Delete stage (Sales Manager only, prevent if deals use it)

### Reporting Endpoints

**Reports API** (`app/api/crm/reports/`)

- [ ] `GET /api/crm/reports/close-rate`
  - Calculate: (Closed Won Deals) / (Total Deals) * 100
  - Filters: `owner_user_id`, `start_date`, `end_date`
  - RBAC: Salesperson sees own metrics, Manager sees all

- [ ] `GET /api/crm/reports/acv` (Average Contract Value)
  - Calculate: Sum of all deal amounts / Count of closed deals
  - Filters: `owner_user_id`, `start_date`, `end_date`
  - RBAC: Salesperson sees own metrics, Manager sees all

- [ ] `GET /api/crm/reports/sales-cycle`
  - Calculate: Average days from deal creation to close
  - Filters: `owner_user_id`, `start_date`, `end_date`
  - RBAC: Salesperson sees own metrics, Manager sees all

- [ ] `GET /api/crm/reports/pipeline-health`
  - Return: Count and total value of deals by pipeline_stage
  - Filters: `owner_user_id`, `start_date`, `end_date`
  - RBAC: Salesperson sees own metrics, Manager sees all

### Integration Endpoints

- [ ] `GET /api/crm/data-export`
  - Secure via API key authentication (check `crm_api_keys` table)
  - Read-only bulk export of contacts, companies, deals, activities
  - Support pagination and filtering
  - Return JSON or CSV format

- [ ] `GET /api/crm/search`
  - Full-text search across contacts, companies, deals
  - Type-ahead support
  - Return grouped results by object type
  - Used by GlobalSearch component

- [ ] `GET/POST/PUT/DELETE /api/crm/webhooks`
  - Manage webhook configurations
  - CRUD operations on `crm_webhook_configs` table

---

## Frontend Components

### ✅ Completed
- Dashboard page structure
- TaskWidget, StuckDealsWidget, ActivityFeed components
- KanbanView component
- GlobalSearch component
- ContactHeader, DealHeader, ActivityLog components
- Basic page components (ContactList, CompanyList, DealList, etc.)
- React hooks for data fetching

### ❌ Remaining / Needs Enhancement

**Page Components** (`src/pages/`)

- [ ] **ContactDetail** - Enhance with:
  - Personal notes section (user-scoped)
  - Related deals list
  - Activity timeline
  - Edit/Delete actions (with RBAC checks)

- [ ] **ContactEdit** - Complete form with:
  - Company selection dropdown
  - Validation (email uniqueness, required fields)
  - Error handling
  - Success redirect

- [ ] **CompanyDetail** - Enhance with:
  - Related contacts list
  - Related deals list
  - Company qualification data display
  - Edit/Delete actions

- [ ] **CompanyEdit** - Complete form with:
  - Qualification fields (num_employees, estimated_revenue)
  - Validation
  - Error handling

- [ ] **DealDetail** - Enhance with:
  - Pipeline stage display and change UI
  - Related activities
  - Related contacts/companies
  - Amount and close date display
  - Edit/Delete actions

- [ ] **DealEdit** - Complete form with:
  - Pipeline stage selection
  - Company and contact selection
  - Amount and date fields
  - Owner assignment (Sales Manager only)
  - Validation

- [ ] **ActivityList** - Enhance with:
  - Filtering by type, date range, related entity
  - Task due date highlighting
  - Activity type badges
  - Quick actions (complete, edit, delete)

- [ ] **ActivityEdit/Create** - Complete form with:
  - Rich text editor for `raw_note_text`
  - LLM parsing toggle (if enabled)
  - Manual override fields (activity_type, task_due_date, task_description)
  - Related contact/deal selection
  - Show LLM parsing results before save

**Component Enhancements**

- [ ] **KanbanView** - Enhance with:
  - Proper drag-and-drop library integration (`@dnd-kit/core` or `react-beautiful-dnd`)
  - Real-time updates
  - Deal count and total value per stage
  - Styling improvements

- [ ] **GlobalSearch** - Enhance with:
  - Keyboard navigation
  - Recent searches
  - Search result highlighting
  - Loading states

- [ ] **TaskWidget** - Enhance with:
  - Mark task as complete action
  - Filter by priority
  - Link to related contact/deal

- [ ] **StuckDealsWidget** - Enhance with:
  - Click to view deal detail
  - Stage duration display
  - Quick reassign action

- [ ] **ActivityFeed** - Enhance with:
  - Infinite scroll
  - Filter by activity type
  - Link to related entities

**New Components Needed**

- [ ] **PipelineStageSelector** - Dropdown/select for pipeline stages
- [ ] **ContactSelector** - Searchable dropdown for selecting contacts
- [ ] **CompanySelector** - Searchable dropdown for selecting companies
- [ ] **ActivityTypeBadge** - Visual badge for activity types
- [ ] **DealAmountDisplay** - Formatted currency display
- [ ] **UserSelector** - For assigning owners (Sales Manager only)
- [ ] **RichTextEditor** - For activity notes (if not using existing UI kit component)

---

## Integration Steps

### Step 1: Build Feature Pack
```bash
cd hit-feature-packs/hit-feature-pack-crm
npm install
npm run build
```

### Step 2: Add to hit-dashboard package.json
```bash
cd applications/hit-dashboard
npm install @hit/feature-pack-crm@file:../../hit-feature-packs/hit-feature-pack-crm
```

### Step 3: Import Schemas
The schemas will be auto-imported via `feature-pack-schemas.ts` when you run:
```bash
hit run
# or
hit commit
```

But you can manually verify in `lib/schema.ts`:
```typescript
// Should auto-import from feature-pack-schemas.ts
export * from './feature-pack-schemas';
```

### Step 4: Create Database Migrations
```bash
cd applications/hit-dashboard
npx drizzle-kit generate
npx drizzle-kit push
```

Or create manual migration file:
- Create `migrations/XXXX_crm_tables.sql` with all table definitions
- Seed default pipeline stages

### Step 5: Create API Endpoints
- Copy pattern from `app/api/crm/contacts-new/route.ts`
- Implement all endpoints listed in [API Endpoints](#api-endpoints)
- Ensure RBAC is enforced on all endpoints
- Add webhook triggers where specified

### Step 6: Update Frontend Routes
The feature pack routes should be auto-loaded, but verify:
- Check `.hit/generated/routes.ts` includes CRM routes
- Verify navigation appears in sidebar
- Test page loading

### Step 7: Configure Feature Flags
Update `hit.yaml` with desired options:
```yaml
feature_packs:
  - name: crm
    version: "1.0.0"
    options:
      pipeline_stages: []  # Or configure custom stages
      openai_enabled: true
      llm_activity_parsing: true
      webhook_enabled: true
      webhook_url: "https://your-webhook-url.com"
      data_export_enabled: true
```

### Step 8: Set Up OpenAI Keys (if enabled)
- Create entries in `crm_openai_keys` table
- Store encrypted API keys
- Test LLM parsing on activity creation

### Step 9: Set Up Webhooks (if enabled)
- Create entries in `crm_webhook_configs` table
- Configure webhook URLs and events
- Test webhook delivery

### Step 10: Test End-to-End
- Create test contacts, companies, deals
- Test RBAC (create test users with different roles)
- Test LLM parsing
- Test webhooks
- Test reporting endpoints
- Test data export API

---

## Feature Flags

### Current Feature Flags (in feature-pack.yaml)

✅ **Implemented:**
- `pipeline_stages` - Configurable pipeline stages
- `openai_enabled` - Enable/disable OpenAI integration
- `llm_activity_parsing` - Enable/disable LLM parsing
- `webhook_enabled` - Enable/disable webhooks
- `webhook_url` - Webhook URL configuration
- `data_export_enabled` - Enable/disable data export API

### Recommended Additional Feature Flags

**UI/UX Features:**
- [ ] `kanban_view_enabled` - Enable/disable Kanban view for deals (default: true)
- [ ] `list_view_enabled` - Enable/disable list view for deals (default: true)
- [ ] `global_search_enabled` - Enable/disable global search (default: true)
- [ ] `activity_feed_enabled` - Enable/disable activity feed widget (default: true)
- [ ] `task_widget_enabled` - Enable/disable task widget (default: true)
- [ ] `stuck_deals_widget_enabled` - Enable/disable stuck deals widget (default: true)
- [ ] `rich_text_editor` - Enable rich text editing for activities (default: false)

**Business Logic Features:**
- [ ] `personal_notes_enabled` - Enable/disable personal notes feature (default: true)
- [ ] `deal_reassignment_enabled` - Enable/disable deal reassignment (default: true)
- [ ] `contact_duplicate_detection` - Enable duplicate contact detection (default: false)
- [ ] `deal_probability_tracking` - Enable probability tracking on deals (default: false)
- [ ] `activity_reminders` - Enable activity reminders/notifications (default: false)
- [ ] `email_integration` - Enable email integration for activities (default: false)

**Reporting Features:**
- [ ] `advanced_reporting_enabled` - Enable advanced reporting features (default: false)
- [ ] `custom_fields_enabled` - Enable custom fields on entities (default: false)
- [ ] `export_formats` - Available export formats: ["json", "csv", "xlsx"] (default: ["json", "csv"])

**Integration Features:**
- [ ] `api_rate_limiting` - Enable API rate limiting (default: true)
- [ ] `webhook_retry_count` - Number of webhook retry attempts (default: 3)
- [ ] `webhook_timeout_seconds` - Webhook timeout in seconds (default: 10)
- [ ] `openai_model` - OpenAI model to use (default: "gpt-4o-mini")
- [ ] `openai_temperature` - OpenAI temperature setting (default: 0.3)

**Security Features:**
- [ ] `require_contact_email` - Require email for contacts (default: false)
- [ ] `require_deal_owner` - Require owner for deals (default: true)
- [ ] `allow_anonymous_activities` - Allow activities without user (default: false)
- [ ] `api_key_expiration_days` - API key expiration in days (default: null, no expiration)

**Multi-tenancy Features:**
- [ ] `multi_tenant_enabled` - Enable multi-tenant support (default: false)
- [ ] `customer_isolation` - Strict customer data isolation (default: false)

---

## Database Migrations

### Migration Script Needed

Create migration file: `migrations/XXXX_create_crm_tables.sql`

**Tables to Create:**
1. `crm_companies`
2. `crm_contacts`
3. `crm_pipeline_stages`
4. `crm_deals`
5. `crm_activities`
6. `crm_personal_notes`
7. `crm_webhook_configs`
8. `crm_api_keys`
9. `crm_openai_keys`

**Seed Data Needed:**
- Default pipeline stages:
  ```sql
  INSERT INTO crm_pipeline_stages (id, name, "order", is_closed_won, is_closed_lost, created_by_user_id, created_on_timestamp, last_updated_on_timestamp)
  VALUES
    (gen_random_uuid(), 'Prospecting', 1, false, false, 'system', NOW(), NOW()),
    (gen_random_uuid(), 'Qualification', 2, false, false, 'system', NOW(), NOW()),
    (gen_random_uuid(), 'Proposal', 3, false, false, 'system', NOW(), NOW()),
    (gen_random_uuid(), 'Negotiation', 4, false, false, 'system', NOW(), NOW()),
    (gen_random_uuid(), 'Closed Won', 5, true, false, 'system', NOW(), NOW()),
    (gen_random_uuid(), 'Closed Lost', 6, false, true, 'system', NOW(), NOW());
  ```

**Indexes to Create:**
- All indexes defined in schema (see `src/schema/crm.ts`)
- Full-text search indexes for contacts, companies, deals (if using PostgreSQL full-text search)

---

## Testing & Validation

### Unit Tests Needed

**Services:**
- [ ] `openai.ts` - Test activity parsing
- [ ] `rbac.ts` - Test permission checks
- [ ] `webhooks.ts` - Test webhook delivery and retry logic

**API Endpoints:**
- [ ] Contacts CRUD with RBAC
- [ ] Companies CRUD with RBAC
- [ ] Deals CRUD with RBAC and webhook triggers
- [ ] Activities CRUD with LLM parsing
- [ ] Reporting endpoints with filters
- [ ] Data export API with authentication

**Components:**
- [ ] Dashboard widgets
- [ ] Kanban view drag-and-drop
- [ ] Global search
- [ ] Form validation

### Integration Tests Needed

- [ ] End-to-end contact creation flow
- [ ] Deal pipeline stage changes trigger webhooks
- [ ] LLM parsing on activity creation
- [ ] RBAC enforcement across all endpoints
- [ ] Data export with API key authentication
- [ ] User decommissioning and deal reassignment

### Manual Testing Checklist

- [ ] Create contact → Verify webhook fired
- [ ] Create deal → Verify owner assignment
- [ ] Move deal to "Closed Won" → Verify webhook fired
- [ ] Create activity → Verify LLM parsing
- [ ] Test Salesperson role → Verify access restrictions
- [ ] Test Sales Manager role → Verify full access
- [ ] Test data export API → Verify authentication
- [ ] Test global search → Verify results
- [ ] Test Kanban view → Verify drag-and-drop updates stage

---

## Documentation Needed

- [ ] API documentation (OpenAPI/Swagger spec)
- [ ] User guide for CRM features
- [ ] Admin guide for configuration
- [ ] Developer guide for extending the feature pack
- [ ] Migration guide from old CRM (if applicable)

---

## Performance Considerations

- [ ] Add database indexes for frequently queried fields
- [ ] Implement pagination on all list endpoints
- [ ] Add caching for pipeline stages (rarely change)
- [ ] Optimize global search query
- [ ] Add rate limiting to API endpoints
- [ ] Implement lazy loading for large lists
- [ ] Add database connection pooling configuration

---

## Security Considerations

- [ ] Encrypt OpenAI API keys in database
- [ ] Hash API keys for data export
- [ ] Implement webhook signature verification
- [ ] Add input validation and sanitization
- [ ] Implement SQL injection prevention (Drizzle ORM handles this)
- [ ] Add CORS configuration for API endpoints
- [ ] Implement request rate limiting
- [ ] Add audit logging for sensitive operations

---

## Notes

- The feature pack structure is complete and ready for implementation
- All schemas are defined and ready for migration
- RBAC utilities are in place and ready to use
- Webhook and OpenAI services are implemented and ready
- Frontend components have basic structure but need completion
- API endpoints need to be created following the pattern in `contacts-new/route.ts`

The foundation is solid - the remaining work is primarily implementing the API endpoints and completing the frontend components.

