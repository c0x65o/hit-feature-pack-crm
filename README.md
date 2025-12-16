# @hit/feature-pack-crm

CRM feature pack with contacts, companies, deals, activities, LLM integration, RBAC, webhooks, and data export.

## Features

- **Companies**: Store organization information with detailed address fields and qualification data
- **Contacts**: Manage individual people with company relationships and contact information
- **Deals**: Track sales opportunities with amounts, pipeline stages, and ownership
- **Activities**: Record tasks, calls, meetings, notes, and emails with LLM-powered parsing
- **Pipeline Stages**: Configurable sales pipeline with default stages (Lead, Qualified, Proposal, Negotiation, Closed Won, Closed Lost)
- **Personal Notes**: User-scoped notes for contacts (private to each user)
- **LLM Integration**: Automatic activity parsing using OpenAI to extract activity types, tasks, and due dates
- **Webhooks**: Configurable webhook notifications for CRM events
- **Data Export**: Bulk data export API with API key authentication
- **RBAC**: Role-based access control with Salesperson and Sales Manager roles
- **Reporting**: Built-in KPIs including close rate, ACV, sales cycle, and pipeline health

## Installation

```bash
npm install @hit/feature-pack-crm
```

## Usage

Add to your `hit.yaml`:

```yaml
feature_packs:
  - name: crm
    version: "1.0.0"
    options:
      pipeline_stages: []  # Array of custom pipeline stages (empty uses defaults)
      openai_enabled: false  # Enable OpenAI LLM integration
      llm_activity_parsing: true  # Enable automatic LLM parsing of activities
      webhook_enabled: false  # Enable webhook notifications
      webhook_url: ""  # Default webhook URL (can be configured per customer)
      data_export_enabled: true  # Enable data export API
```

Import the schema into your Drizzle schema:

```typescript
import {
  crmContacts,
  crmCompanies,
  crmDeals,
  crmActivities,
  crmPersonalNotes,
  crmPipelineStages,
  crmWebhookConfigs,
  crmApiKeys,
  crmOpenaiKeys,
} from '@hit/feature-pack-crm/schema';
```

## Schema

The feature pack provides the following database tables:

- `crm_companies` - Company/organization information
- `crm_contacts` - Individual contacts/people
- `crm_deals` - Sales deals/opportunities
- `crm_activities` - Tasks, calls, meetings, notes, emails
- `crm_personal_notes` - User-scoped notes for contacts
- `crm_pipeline_stages` - Configurable pipeline stages
- `crm_webhook_configs` - Webhook configuration (per customer)
- `crm_api_keys` - API keys for data export authentication
- `crm_openai_keys` - Encrypted OpenAI API keys (per customer)

## API Routes

The feature pack expects the following API routes to be implemented:

- `/api/crm/contacts` - Contact CRUD (GET, POST)
- `/api/crm/contacts/[id]` - Contact detail/update/delete (GET, PUT, DELETE)
- `/api/crm/companies` - Company CRUD (GET, POST)
- `/api/crm/companies/[id]` - Company detail/update/delete (GET, PUT, DELETE)
- `/api/crm/deals` - Deal CRUD (GET, POST)
- `/api/crm/deals/[id]` - Deal detail/update/delete (GET, PUT, DELETE)
- `/api/crm/deals/reassign` - Reassign deals from inactive user (POST)
- `/api/crm/activities` - Activity CRUD (GET, POST)
- `/api/crm/activities/[id]` - Activity detail/update/delete (GET, PUT, DELETE)
- `/api/crm/personal-notes` - Personal notes CRUD (GET, POST)
- `/api/crm/reports/close-rate` - Close rate KPI (GET)
- `/api/crm/reports/acv` - Average contract value KPI (GET)
- `/api/crm/reports/sales-cycle` - Sales cycle length KPI (GET)
- `/api/crm/reports/pipeline-health` - Pipeline health by stage (GET)
- `/api/crm/data-export` - Bulk data export (GET, requires API key)
- `/api/crm/webhooks` - Webhook configuration management (GET, POST, PUT, DELETE)
- `/api/crm/search` - Global search across contacts, companies, deals (GET)

See `feature-pack.yaml` for complete API route documentation.

## Permissions

The feature pack uses role-based access control (RBAC) with two roles:

### Salesperson
- Read/write access limited to own records (contacts, deals, activities)
- Read-only access to all companies
- Personal metrics/reports only
- Can create and manage personal notes

### Sales Manager
- Full read/write/delete access to all CRM objects
- Access to all metrics and reports
- Can reassign deals between users
- Can manage pipeline stages
- Can configure webhooks and API keys

**Note**: Backend implementation must enforce RBAC on all API endpoints. The feature pack provides the schema and UI only.

## LLM Integration

When `openai_enabled` and `llm_activity_parsing` are enabled, the feature pack can automatically parse activity text using OpenAI:

- Extracts activity type (Call, Meeting, Note, Email)
- Identifies task due dates
- Generates task descriptions
- All parsed fields are editable for manual override

OpenAI API keys are stored encrypted in `crm_openai_keys` table (per customer).

## Webhooks

When `webhook_enabled` is true, the feature pack can send webhook notifications for CRM events:

- Deal stage changes
- Contact creation
- Task due dates
- Other configurable events

Webhook configurations are stored in `crm_webhook_configs` table (per customer).

## Development

```bash
npm install
npm run dev  # Watch mode
npm run build  # Build for production
```

## License

MIT

