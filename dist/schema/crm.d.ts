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
/**
 * CRM Companies Table
 * Stores company/organization information
 */
export declare const crmCompanies: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "crm_companies";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "crm_companies";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        name: import("drizzle-orm/pg-core").PgColumn<{
            name: "name";
            tableName: "crm_companies";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        address1: import("drizzle-orm/pg-core").PgColumn<{
            name: "address1";
            tableName: "crm_companies";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        address2: import("drizzle-orm/pg-core").PgColumn<{
            name: "address2";
            tableName: "crm_companies";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        city: import("drizzle-orm/pg-core").PgColumn<{
            name: "city";
            tableName: "crm_companies";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        state: import("drizzle-orm/pg-core").PgColumn<{
            name: "state";
            tableName: "crm_companies";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        postalCode: import("drizzle-orm/pg-core").PgColumn<{
            name: "postal_code";
            tableName: "crm_companies";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        country: import("drizzle-orm/pg-core").PgColumn<{
            name: "country";
            tableName: "crm_companies";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        address: import("drizzle-orm/pg-core").PgColumn<{
            name: "address";
            tableName: "crm_companies";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        website: import("drizzle-orm/pg-core").PgColumn<{
            name: "website";
            tableName: "crm_companies";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        companyPhone: import("drizzle-orm/pg-core").PgColumn<{
            name: "company_phone";
            tableName: "crm_companies";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        companyEmail: import("drizzle-orm/pg-core").PgColumn<{
            name: "company_email";
            tableName: "crm_companies";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        numEmployees: import("drizzle-orm/pg-core").PgColumn<{
            name: "num_employees";
            tableName: "crm_companies";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        estimatedRevenue: import("drizzle-orm/pg-core").PgColumn<{
            name: "estimated_revenue";
            tableName: "crm_companies";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        createdByUserId: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_by_user_id";
            tableName: "crm_companies";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        createdOnTimestamp: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_on_timestamp";
            tableName: "crm_companies";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        lastUpdatedByUserId: import("drizzle-orm/pg-core").PgColumn<{
            name: "last_updated_by_user_id";
            tableName: "crm_companies";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        lastUpdatedOnTimestamp: import("drizzle-orm/pg-core").PgColumn<{
            name: "last_updated_on_timestamp";
            tableName: "crm_companies";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
/**
 * CRM Contacts Table
 * Stores individual people/contacts
 */
export declare const crmContacts: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "crm_contacts";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "crm_contacts";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        name: import("drizzle-orm/pg-core").PgColumn<{
            name: "name";
            tableName: "crm_contacts";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        title: import("drizzle-orm/pg-core").PgColumn<{
            name: "title";
            tableName: "crm_contacts";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        companyId: import("drizzle-orm/pg-core").PgColumn<{
            name: "company_id";
            tableName: "crm_contacts";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        address1: import("drizzle-orm/pg-core").PgColumn<{
            name: "address1";
            tableName: "crm_contacts";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        address2: import("drizzle-orm/pg-core").PgColumn<{
            name: "address2";
            tableName: "crm_contacts";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        city: import("drizzle-orm/pg-core").PgColumn<{
            name: "city";
            tableName: "crm_contacts";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        state: import("drizzle-orm/pg-core").PgColumn<{
            name: "state";
            tableName: "crm_contacts";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        postalCode: import("drizzle-orm/pg-core").PgColumn<{
            name: "postal_code";
            tableName: "crm_contacts";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        country: import("drizzle-orm/pg-core").PgColumn<{
            name: "country";
            tableName: "crm_contacts";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        phone: import("drizzle-orm/pg-core").PgColumn<{
            name: "phone";
            tableName: "crm_contacts";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        email: import("drizzle-orm/pg-core").PgColumn<{
            name: "email";
            tableName: "crm_contacts";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        lastContactedDate: import("drizzle-orm/pg-core").PgColumn<{
            name: "last_contacted_date";
            tableName: "crm_contacts";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        createdByUserId: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_by_user_id";
            tableName: "crm_contacts";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        createdOnTimestamp: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_on_timestamp";
            tableName: "crm_contacts";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        lastUpdatedByUserId: import("drizzle-orm/pg-core").PgColumn<{
            name: "last_updated_by_user_id";
            tableName: "crm_contacts";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        lastUpdatedOnTimestamp: import("drizzle-orm/pg-core").PgColumn<{
            name: "last_updated_on_timestamp";
            tableName: "crm_contacts";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
/**
 * CRM Pipeline Stages Table
 * Master list of configurable pipeline stages
 */
export declare const crmPipelineStages: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "crm_pipeline_stages";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "crm_pipeline_stages";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        code: import("drizzle-orm/pg-core").PgColumn<{
            name: "code";
            tableName: "crm_pipeline_stages";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        name: import("drizzle-orm/pg-core").PgColumn<{
            name: "name";
            tableName: "crm_pipeline_stages";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        order: import("drizzle-orm/pg-core").PgColumn<{
            name: "order";
            tableName: "crm_pipeline_stages";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        isClosedWon: import("drizzle-orm/pg-core").PgColumn<{
            name: "is_closed_won";
            tableName: "crm_pipeline_stages";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        isClosedLost: import("drizzle-orm/pg-core").PgColumn<{
            name: "is_closed_lost";
            tableName: "crm_pipeline_stages";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        isSystem: import("drizzle-orm/pg-core").PgColumn<{
            name: "is_system";
            tableName: "crm_pipeline_stages";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        customerConfig: import("drizzle-orm/pg-core").PgColumn<{
            name: "customer_config";
            tableName: "crm_pipeline_stages";
            dataType: "json";
            columnType: "PgJsonb";
            data: unknown;
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        createdByUserId: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_by_user_id";
            tableName: "crm_pipeline_stages";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        createdOnTimestamp: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_on_timestamp";
            tableName: "crm_pipeline_stages";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        lastUpdatedByUserId: import("drizzle-orm/pg-core").PgColumn<{
            name: "last_updated_by_user_id";
            tableName: "crm_pipeline_stages";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        lastUpdatedOnTimestamp: import("drizzle-orm/pg-core").PgColumn<{
            name: "last_updated_on_timestamp";
            tableName: "crm_pipeline_stages";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
/**
 * CRM Deals Table
 * Stores sales deals/opportunities
 */
export declare const crmDeals: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "crm_deals";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "crm_deals";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        dealName: import("drizzle-orm/pg-core").PgColumn<{
            name: "deal_name";
            tableName: "crm_deals";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        amount: import("drizzle-orm/pg-core").PgColumn<{
            name: "amount";
            tableName: "crm_deals";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        closeDateEstimate: import("drizzle-orm/pg-core").PgColumn<{
            name: "close_date_estimate";
            tableName: "crm_deals";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        ownerUserId: import("drizzle-orm/pg-core").PgColumn<{
            name: "owner_user_id";
            tableName: "crm_deals";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        companyId: import("drizzle-orm/pg-core").PgColumn<{
            name: "company_id";
            tableName: "crm_deals";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        primaryContactId: import("drizzle-orm/pg-core").PgColumn<{
            name: "primary_contact_id";
            tableName: "crm_deals";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        pipelineStage: import("drizzle-orm/pg-core").PgColumn<{
            name: "pipeline_stage";
            tableName: "crm_deals";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        stageEnteredAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "stage_entered_at";
            tableName: "crm_deals";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        createdByUserId: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_by_user_id";
            tableName: "crm_deals";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        createdOnTimestamp: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_on_timestamp";
            tableName: "crm_deals";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        lastUpdatedByUserId: import("drizzle-orm/pg-core").PgColumn<{
            name: "last_updated_by_user_id";
            tableName: "crm_deals";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        lastUpdatedOnTimestamp: import("drizzle-orm/pg-core").PgColumn<{
            name: "last_updated_on_timestamp";
            tableName: "crm_deals";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
/**
 * CRM Activities Table
 * Stores tasks, calls, meetings, notes, emails
 * LLM-parsed fields for activity classification
 */
export declare const crmActivities: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "crm_activities";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "crm_activities";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        rawNoteText: import("drizzle-orm/pg-core").PgColumn<{
            name: "raw_note_text";
            tableName: "crm_activities";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        relatedContactId: import("drizzle-orm/pg-core").PgColumn<{
            name: "related_contact_id";
            tableName: "crm_activities";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        relatedDealId: import("drizzle-orm/pg-core").PgColumn<{
            name: "related_deal_id";
            tableName: "crm_activities";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        userId: import("drizzle-orm/pg-core").PgColumn<{
            name: "user_id";
            tableName: "crm_activities";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        activityType: import("drizzle-orm/pg-core").PgColumn<{
            name: "activity_type";
            tableName: "crm_activities";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        taskDueDate: import("drizzle-orm/pg-core").PgColumn<{
            name: "task_due_date";
            tableName: "crm_activities";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        taskDescription: import("drizzle-orm/pg-core").PgColumn<{
            name: "task_description";
            tableName: "crm_activities";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        createdByUserId: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_by_user_id";
            tableName: "crm_activities";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        createdOnTimestamp: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_on_timestamp";
            tableName: "crm_activities";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        lastUpdatedByUserId: import("drizzle-orm/pg-core").PgColumn<{
            name: "last_updated_by_user_id";
            tableName: "crm_activities";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        lastUpdatedOnTimestamp: import("drizzle-orm/pg-core").PgColumn<{
            name: "last_updated_on_timestamp";
            tableName: "crm_activities";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const crmCompaniesRelations: import("drizzle-orm").Relations<"crm_companies", {
    contacts: import("drizzle-orm").Many<"crm_contacts">;
    deals: import("drizzle-orm").Many<"crm_deals">;
}>;
export declare const crmContactsRelations: import("drizzle-orm").Relations<"crm_contacts", {
    company: import("drizzle-orm").One<"crm_companies", false>;
    deals: import("drizzle-orm").Many<"crm_deals">;
    activities: import("drizzle-orm").Many<"crm_activities">;
}>;
export declare const crmDealsRelations: import("drizzle-orm").Relations<"crm_deals", {
    company: import("drizzle-orm").One<"crm_companies", false>;
    primaryContact: import("drizzle-orm").One<"crm_contacts", false>;
    pipelineStage: import("drizzle-orm").One<"crm_pipeline_stages", true>;
    activities: import("drizzle-orm").Many<"crm_activities">;
}>;
export declare const crmActivitiesRelations: import("drizzle-orm").Relations<"crm_activities", {
    relatedContact: import("drizzle-orm").One<"crm_contacts", false>;
    relatedDeal: import("drizzle-orm").One<"crm_deals", false>;
}>;
export declare const crmPipelineStagesRelations: import("drizzle-orm").Relations<"crm_pipeline_stages", {
    deals: import("drizzle-orm").Many<"crm_deals">;
}>;
export type CrmCompany = typeof crmCompanies.$inferSelect;
export type InsertCrmCompany = typeof crmCompanies.$inferInsert;
export type UpdateCrmCompany = Partial<Omit<InsertCrmCompany, "id" | "createdByUserId" | "createdOnTimestamp">>;
export type CrmContact = typeof crmContacts.$inferSelect;
export type InsertCrmContact = typeof crmContacts.$inferInsert;
export type UpdateCrmContact = Partial<Omit<InsertCrmContact, "id" | "createdByUserId" | "createdOnTimestamp">>;
export type CrmDeal = typeof crmDeals.$inferSelect;
export type InsertCrmDeal = typeof crmDeals.$inferInsert;
export type UpdateCrmDeal = Partial<Omit<InsertCrmDeal, "id" | "createdByUserId" | "createdOnTimestamp">>;
export type CrmActivity = typeof crmActivities.$inferSelect;
export type InsertCrmActivity = typeof crmActivities.$inferInsert;
export type UpdateCrmActivity = Partial<Omit<InsertCrmActivity, "id" | "createdByUserId" | "createdOnTimestamp">>;
export type CrmPipelineStage = typeof crmPipelineStages.$inferSelect;
export type InsertCrmPipelineStage = typeof crmPipelineStages.$inferInsert;
export type UpdateCrmPipelineStage = Partial<Omit<InsertCrmPipelineStage, "id" | "createdByUserId" | "createdOnTimestamp">>;
/**
 * Default CRM pipeline stages to be seeded
 * These are inserted via migration or API initialization
 */
export declare const DEFAULT_CRM_PIPELINE_STAGES: Omit<InsertCrmPipelineStage, "id" | "createdByUserId" | "createdOnTimestamp">[];
//# sourceMappingURL=crm.d.ts.map