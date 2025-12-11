/**
 * CRM Schema
 *
 * Drizzle table definitions for the CRM feature pack.
 * This schema gets merged into the project's database.
 *
 * All tables include standard audit fields:
 * - id (primary key)
 * - created_by_user_id (user who created the record)
 * - created_on_timestamp (when record was created)
 * - last_updated_by_user_id (user who last updated the record)
 * - last_updated_on_timestamp (when record was last updated)
 */
import { pgTable, varchar, text, timestamp, uuid, decimal, integer, boolean, jsonb, index, unique, } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
/**
 * CRM Companies Table
 * Stores company/organization information
 */
export const crmCompanies = pgTable("crm_companies", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    address: text("address"),
    website: varchar("website", { length: 255 }),
    companyPhone: varchar("company_phone", { length: 50 }),
    companyEmail: varchar("company_email", { length: 255 }),
    numEmployees: integer("num_employees"), // Configurable qualification data
    estimatedRevenue: decimal("estimated_revenue", { precision: 20, scale: 2 }), // Configurable qualification data
    // Audit fields
    createdByUserId: varchar("created_by_user_id", { length: 255 }).notNull(),
    createdOnTimestamp: timestamp("created_on_timestamp").defaultNow().notNull(),
    lastUpdatedByUserId: varchar("last_updated_by_user_id", { length: 255 }),
    lastUpdatedOnTimestamp: timestamp("last_updated_on_timestamp").defaultNow().notNull(),
}, (table) => ({
    nameIdx: unique("crm_companies_name_unique").on(table.name),
    createdByIdx: index("crm_companies_created_by_idx").on(table.createdByUserId),
}));
/**
 * CRM Contacts Table
 * Stores individual people/contacts
 */
export const crmContacts = pgTable("crm_contacts", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    title: varchar("title", { length: 100 }),
    companyId: uuid("company_id").references(() => crmCompanies.id, { onDelete: "set null" }),
    phone: varchar("phone", { length: 50 }),
    email: varchar("email", { length: 255 }),
    lastContactedDate: timestamp("last_contacted_date"), // Auto-updated by Activity
    // Audit fields
    createdByUserId: varchar("created_by_user_id", { length: 255 }).notNull(),
    createdOnTimestamp: timestamp("created_on_timestamp").defaultNow().notNull(),
    lastUpdatedByUserId: varchar("last_updated_by_user_id", { length: 255 }),
    lastUpdatedOnTimestamp: timestamp("last_updated_on_timestamp").defaultNow().notNull(),
}, (table) => ({
    emailIdx: unique("crm_contacts_email_unique").on(table.email),
    companyIdx: index("crm_contacts_company_idx").on(table.companyId),
    createdByIdx: index("crm_contacts_created_by_idx").on(table.createdByUserId),
    emailSearchIdx: index("crm_contacts_email_idx").on(table.email),
}));
/**
 * CRM Pipeline Stages Table
 * Master list of configurable pipeline stages
 */
export const crmPipelineStages = pgTable("crm_pipeline_stages", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    order: integer("order").notNull(),
    isClosedWon: boolean("is_closed_won").notNull().default(false),
    isClosedLost: boolean("is_closed_lost").notNull().default(false),
    customerConfig: jsonb("customer_config"), // Per-customer configuration (JSONB)
    // Audit fields
    createdByUserId: varchar("created_by_user_id", { length: 255 }).notNull(),
    createdOnTimestamp: timestamp("created_on_timestamp").defaultNow().notNull(),
    lastUpdatedByUserId: varchar("last_updated_by_user_id", { length: 255 }),
    lastUpdatedOnTimestamp: timestamp("last_updated_on_timestamp").defaultNow().notNull(),
}, (table) => ({
    orderIdx: index("crm_pipeline_stages_order_idx").on(table.order),
    nameIdx: unique("crm_pipeline_stages_name_unique").on(table.name),
}));
/**
 * CRM Deals Table
 * Stores sales deals/opportunities
 */
export const crmDeals = pgTable("crm_deals", {
    id: uuid("id").primaryKey().defaultRandom(),
    dealName: varchar("deal_name", { length: 255 }).notNull(),
    amount: decimal("amount", { precision: 20, scale: 2 }).notNull(),
    closeDateEstimate: timestamp("close_date_estimate"),
    ownerUserId: varchar("owner_user_id", { length: 255 }).notNull(), // Mandatory FK to user
    companyId: uuid("company_id").references(() => crmCompanies.id, { onDelete: "cascade" }),
    primaryContactId: uuid("primary_contact_id").references(() => crmContacts.id, { onDelete: "set null" }),
    pipelineStage: uuid("pipeline_stage").references(() => crmPipelineStages.id, { onDelete: "restrict" }).notNull(),
    stageEnteredAt: timestamp("stage_entered_at").defaultNow().notNull(), // Track when deal entered current stage
    // Audit fields
    createdByUserId: varchar("created_by_user_id", { length: 255 }).notNull(),
    createdOnTimestamp: timestamp("created_on_timestamp").defaultNow().notNull(),
    lastUpdatedByUserId: varchar("last_updated_by_user_id", { length: 255 }),
    lastUpdatedOnTimestamp: timestamp("last_updated_on_timestamp").defaultNow().notNull(),
}, (table) => ({
    ownerIdx: index("crm_deals_owner_idx").on(table.ownerUserId),
    companyIdx: index("crm_deals_company_idx").on(table.companyId),
    contactIdx: index("crm_deals_contact_idx").on(table.primaryContactId),
    stageIdx: index("crm_deals_stage_idx").on(table.pipelineStage),
    stageEnteredIdx: index("crm_deals_stage_entered_idx").on(table.stageEnteredAt),
}));
/**
 * CRM Activities Table
 * Stores tasks, calls, meetings, notes, emails
 * LLM-parsed fields for activity classification
 */
export const crmActivities = pgTable("crm_activities", {
    id: uuid("id").primaryKey().defaultRandom(),
    rawNoteText: text("raw_note_text").notNull(), // Rich text - source for LLM parsing
    relatedContactId: uuid("related_contact_id").references(() => crmContacts.id, { onDelete: "cascade" }),
    relatedDealId: uuid("related_deal_id").references(() => crmDeals.id, { onDelete: "cascade" }), // Optional
    userId: varchar("user_id", { length: 255 }).notNull(), // Creator FK to user
    // LLM-parsed fields (editable by user for manual override)
    activityType: varchar("activity_type", { length: 50 }), // Enum: Call, Meeting, Note, Email
    taskDueDate: timestamp("task_due_date"), // Prioritized task due date from LLM
    taskDescription: text("task_description"), // Derived task description from LLM
    // Audit fields
    createdByUserId: varchar("created_by_user_id", { length: 255 }).notNull(),
    createdOnTimestamp: timestamp("created_on_timestamp").defaultNow().notNull(),
    lastUpdatedByUserId: varchar("last_updated_by_user_id", { length: 255 }),
    lastUpdatedOnTimestamp: timestamp("last_updated_on_timestamp").defaultNow().notNull(),
}, (table) => ({
    contactIdx: index("crm_activities_contact_idx").on(table.relatedContactId),
    dealIdx: index("crm_activities_deal_idx").on(table.relatedDealId),
    userIdx: index("crm_activities_user_idx").on(table.userId),
    taskDueIdx: index("crm_activities_task_due_idx").on(table.taskDueDate),
    createdByIdx: index("crm_activities_created_by_idx").on(table.createdByUserId),
}));
/**
 * CRM Personal Notes Table
 * User-scoped notes for contacts (child object of CRM_Contact)
 * Retrieval scoped exclusively to user_id matching authenticated user
 */
export const crmPersonalNotes = pgTable("crm_personal_notes", {
    id: uuid("id").primaryKey().defaultRandom(),
    contactId: uuid("contact_id").references(() => crmContacts.id, { onDelete: "cascade" }).notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(), // Note creator FK to user
    noteText: text("note_text").notNull(), // Rich text
    // Audit fields
    createdByUserId: varchar("created_by_user_id", { length: 255 }).notNull(),
    createdOnTimestamp: timestamp("created_on_timestamp").defaultNow().notNull(),
    lastUpdatedByUserId: varchar("last_updated_by_user_id", { length: 255 }),
    lastUpdatedOnTimestamp: timestamp("last_updated_on_timestamp").defaultNow().notNull(),
}, (table) => ({
    contactIdx: index("crm_personal_notes_contact_idx").on(table.contactId),
    userIdx: index("crm_personal_notes_user_idx").on(table.userId),
    contactUserIdx: index("crm_personal_notes_contact_user_idx").on(table.contactId, table.userId),
}));
/**
 * CRM Webhook Configs Table
 * Per-customer webhook configuration
 */
export const crmWebhookConfigs = pgTable("crm_webhook_configs", {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: varchar("customer_id", { length: 255 }), // Optional: for multi-tenant support
    webhookUrl: varchar("webhook_url", { length: 500 }).notNull(),
    isEnabled: boolean("is_enabled").notNull().default(true),
    events: jsonb("events").notNull(), // Array of event types to trigger on
    secret: varchar("secret", { length: 255 }), // Optional webhook secret for signature verification
    // Audit fields
    createdByUserId: varchar("created_by_user_id", { length: 255 }).notNull(),
    createdOnTimestamp: timestamp("created_on_timestamp").defaultNow().notNull(),
    lastUpdatedByUserId: varchar("last_updated_by_user_id", { length: 255 }),
    lastUpdatedOnTimestamp: timestamp("last_updated_on_timestamp").defaultNow().notNull(),
}, (table) => ({
    customerIdx: index("crm_webhook_configs_customer_idx").on(table.customerId),
}));
/**
 * CRM API Keys Table
 * API keys for data export authentication (per customer/user)
 */
export const crmApiKeys = pgTable("crm_api_keys", {
    id: uuid("id").primaryKey().defaultRandom(),
    keyHash: varchar("key_hash", { length: 255 }).notNull(), // Hashed API key
    customerId: varchar("customer_id", { length: 255 }), // Optional: for multi-tenant support
    userId: varchar("user_id", { length: 255 }), // Optional: per-user API keys
    name: varchar("name", { length: 255 }), // Human-readable name for the key
    isActive: boolean("is_active").notNull().default(true),
    lastUsedAt: timestamp("last_used_at"),
    expiresAt: timestamp("expires_at"), // Optional expiration
    // Audit fields
    createdByUserId: varchar("created_by_user_id", { length: 255 }).notNull(),
    createdOnTimestamp: timestamp("created_on_timestamp").defaultNow().notNull(),
    lastUpdatedByUserId: varchar("last_updated_by_user_id", { length: 255 }),
    lastUpdatedOnTimestamp: timestamp("last_updated_on_timestamp").defaultNow().notNull(),
}, (table) => ({
    keyHashIdx: unique("crm_api_keys_hash_unique").on(table.keyHash),
    customerIdx: index("crm_api_keys_customer_idx").on(table.customerId),
    userIdx: index("crm_api_keys_user_idx").on(table.userId),
}));
/**
 * CRM OpenAI Keys Table
 * Per-customer OpenAI API keys for LLM integration
 */
export const crmOpenaiKeys = pgTable("crm_openai_keys", {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: varchar("customer_id", { length: 255 }), // Optional: for multi-tenant support
    keyEncrypted: text("key_encrypted").notNull(), // Encrypted OpenAI API key
    isActive: boolean("is_active").notNull().default(true),
    lastUsedAt: timestamp("last_used_at"),
    // Audit fields
    createdByUserId: varchar("created_by_user_id", { length: 255 }).notNull(),
    createdOnTimestamp: timestamp("created_on_timestamp").defaultNow().notNull(),
    lastUpdatedByUserId: varchar("last_updated_by_user_id", { length: 255 }),
    lastUpdatedOnTimestamp: timestamp("last_updated_on_timestamp").defaultNow().notNull(),
}, (table) => ({
    customerIdx: index("crm_openai_keys_customer_idx").on(table.customerId),
}));
// Relations for Drizzle ORM
export const crmCompaniesRelations = relations(crmCompanies, ({ many }) => ({
    contacts: many(crmContacts),
    deals: many(crmDeals),
}));
export const crmContactsRelations = relations(crmContacts, ({ one, many }) => ({
    company: one(crmCompanies, {
        fields: [crmContacts.companyId],
        references: [crmCompanies.id],
    }),
    deals: many(crmDeals),
    activities: many(crmActivities),
    personalNotes: many(crmPersonalNotes),
}));
export const crmDealsRelations = relations(crmDeals, ({ one, many }) => ({
    company: one(crmCompanies, {
        fields: [crmDeals.companyId],
        references: [crmCompanies.id],
    }),
    primaryContact: one(crmContacts, {
        fields: [crmDeals.primaryContactId],
        references: [crmContacts.id],
    }),
    pipelineStage: one(crmPipelineStages, {
        fields: [crmDeals.pipelineStage],
        references: [crmPipelineStages.id],
    }),
    activities: many(crmActivities),
}));
export const crmActivitiesRelations = relations(crmActivities, ({ one }) => ({
    relatedContact: one(crmContacts, {
        fields: [crmActivities.relatedContactId],
        references: [crmContacts.id],
    }),
    relatedDeal: one(crmDeals, {
        fields: [crmActivities.relatedDealId],
        references: [crmDeals.id],
    }),
}));
export const crmPersonalNotesRelations = relations(crmPersonalNotes, ({ one }) => ({
    contact: one(crmContacts, {
        fields: [crmPersonalNotes.contactId],
        references: [crmContacts.id],
    }),
}));
export const crmPipelineStagesRelations = relations(crmPipelineStages, ({ many }) => ({
    deals: many(crmDeals),
}));
//# sourceMappingURL=crm.js.map