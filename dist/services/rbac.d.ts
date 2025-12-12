/**
 * Role-Based Access Control (RBAC) for CRM
 *
 * Implements role-based permissions:
 * - Salesperson: Read/write access limited to own records, read-only for companies, personal metrics only
 * - Sales Manager: Full read/write/delete access to all CRM objects, all metrics/reports
 *
 * Note: Delete permissions are currently unrestricted for all authenticated users.
 * Proper permission logic should be implemented via the permission manager.
 */
export type CrmRole = "salesperson" | "sales_manager";
export interface UserContext {
    userId: string;
    email: string;
    roles: string[];
}
/**
 * Check if user has a specific role
 */
export declare function hasRole(user: UserContext, role: CrmRole): boolean;
/**
 * Check if user is a sales manager
 */
export declare function isSalesManager(user: UserContext): boolean;
/**
 * Check if user is a salesperson (or has salesperson role)
 */
export declare function isSalesperson(user: UserContext): boolean;
/**
 * Check if user can access a record (based on ownership)
 * Salesperson can only access their own records
 * Sales Manager can access all records
 */
export declare function canAccessRecord(user: UserContext, recordOwnerId: string | null | undefined): boolean;
/**
 * Check if user can read a record
 * - Salesperson: Can read own records + all companies (read-only)
 * - Sales Manager: Can read all records
 */
export declare function canReadRecord(user: UserContext, recordOwnerId: string | null | undefined, recordType: "company" | "contact" | "deal" | "activity" | "personal_note"): boolean;
/**
 * Check if user can write (create/update) a record
 * - Salesperson: Can write own records only
 * - Sales Manager: Can write all records
 */
export declare function canWriteRecord(user: UserContext, recordOwnerId: string | null | undefined): boolean;
/**
 * Check if user can delete a record
 * Note: Currently allows all authenticated users to delete.
 * Proper permission logic should be implemented via the permission manager.
 */
export declare function canDeleteRecord(user: UserContext): boolean;
/**
 * Check if user can access metrics/reports
 * - Salesperson: Personal metrics only
 * - Sales Manager: All metrics/reports
 */
export declare function canAccessMetrics(user: UserContext, metricsType: "personal" | "all"): boolean;
/**
 * Filter records based on user permissions
 * Returns a filter condition for database queries
 */
export declare function getRecordFilter(user: UserContext, recordType: "company" | "contact" | "deal" | "activity" | "personal_note", ownerField?: string): {
    [key: string]: any;
} | null;
/**
 * Extract user context from JWT token or request
 * This should be implemented by the consuming application
 * to extract user info from auth headers
 */
export declare function extractUserFromRequest(request: any): UserContext | null;
/**
 * Assert that user has required permission, throw error if not
 */
export declare function assertCanRead(user: UserContext, recordOwnerId: string | null | undefined, recordType: "company" | "contact" | "deal" | "activity" | "personal_note"): void;
export declare function assertCanWrite(user: UserContext, recordOwnerId: string | null | undefined): void;
export declare function assertCanDelete(user: UserContext): void;
export declare function assertCanAccessMetrics(user: UserContext, metricsType: "personal" | "all"): void;
//# sourceMappingURL=rbac.d.ts.map