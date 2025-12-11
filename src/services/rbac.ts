/**
 * Role-Based Access Control (RBAC) for CRM
 * 
 * Implements role-based permissions:
 * - Salesperson: Read/write access limited to own records, read-only for companies, personal metrics only
 * - Sales Manager: Full read/write/delete access to all CRM objects, all metrics/reports
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
export function hasRole(user: UserContext, role: CrmRole): boolean {
  return user.roles.includes(role);
}

/**
 * Check if user is a sales manager
 */
export function isSalesManager(user: UserContext): boolean {
  return hasRole(user, "sales_manager");
}

/**
 * Check if user is a salesperson (or has salesperson role)
 */
export function isSalesperson(user: UserContext): boolean {
  return hasRole(user, "salesperson");
}

/**
 * Check if user can access a record (based on ownership)
 * Salesperson can only access their own records
 * Sales Manager can access all records
 */
export function canAccessRecord(
  user: UserContext,
  recordOwnerId: string | null | undefined
): boolean {
  if (isSalesManager(user)) {
    return true; // Sales managers have full access
  }

  if (isSalesperson(user)) {
    // Salesperson can only access their own records
    return recordOwnerId === user.userId;
  }

  // Default: deny access if role not recognized
  return false;
}

/**
 * Check if user can read a record
 * - Salesperson: Can read own records + all companies (read-only)
 * - Sales Manager: Can read all records
 */
export function canReadRecord(
  user: UserContext,
  recordOwnerId: string | null | undefined,
  recordType: "company" | "contact" | "deal" | "activity" | "personal_note"
): boolean {
  if (isSalesManager(user)) {
    return true; // Sales managers have full read access
  }

  if (isSalesperson(user)) {
    // Salesperson can read:
    // - Own records (contacts, deals, activities, personal notes)
    // - All companies (read-only)
    if (recordType === "company") {
      return true; // All companies are readable
    }
    return recordOwnerId === user.userId; // Own records only
  }

  return false;
}

/**
 * Check if user can write (create/update) a record
 * - Salesperson: Can write own records only
 * - Sales Manager: Can write all records
 */
export function canWriteRecord(
  user: UserContext,
  recordOwnerId: string | null | undefined
): boolean {
  if (isSalesManager(user)) {
    return true; // Sales managers have full write access
  }

  if (isSalesperson(user)) {
    // Salesperson can only write their own records
    // For new records, recordOwnerId will be null, so allow if user is creating
    return !recordOwnerId || recordOwnerId === user.userId;
  }

  return false;
}

/**
 * Check if user can delete a record
 * - Salesperson: Cannot delete (read-only except for own writes)
 * - Sales Manager: Can delete all records
 */
export function canDeleteRecord(user: UserContext): boolean {
  return isSalesManager(user); // Only sales managers can delete
}

/**
 * Check if user can access metrics/reports
 * - Salesperson: Personal metrics only
 * - Sales Manager: All metrics/reports
 */
export function canAccessMetrics(
  user: UserContext,
  metricsType: "personal" | "all"
): boolean {
  if (isSalesManager(user)) {
    return true; // Sales managers can access all metrics
  }

  if (isSalesperson(user)) {
    return metricsType === "personal"; // Salesperson can only access personal metrics
  }

  return false;
}

/**
 * Filter records based on user permissions
 * Returns a filter condition for database queries
 */
export function getRecordFilter(
  user: UserContext,
  recordType: "company" | "contact" | "deal" | "activity" | "personal_note",
  ownerField: string = "ownerUserId"
): { [key: string]: any } | null {
  if (isSalesManager(user)) {
    return null; // No filter - can access all records
  }

  if (isSalesperson(user)) {
    if (recordType === "company") {
      return null; // Can read all companies
    }
    // For personal notes, filter by userId field instead of ownerUserId
    if (recordType === "personal_note") {
      return { userId: user.userId };
    }
    // For other records, filter by owner
    return { [ownerField]: user.userId };
  }

  // Default: deny access
  return { [ownerField]: null }; // Return impossible filter
}

/**
 * Extract user context from JWT token or request
 * This should be implemented by the consuming application
 * to extract user info from auth headers
 */
export function extractUserFromRequest(request: any): UserContext | null {
  // This is a placeholder - actual implementation depends on auth system
  // The consuming app should implement this based on their auth module
  // Example:
  // const token = request.headers.get('authorization')?.replace('Bearer ', '');
  // const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // return {
  //   userId: decoded.sub,
  //   email: decoded.email,
  //   roles: decoded.roles || [],
  // };
  return null;
}

/**
 * Assert that user has required permission, throw error if not
 */
export function assertCanRead(
  user: UserContext,
  recordOwnerId: string | null | undefined,
  recordType: "company" | "contact" | "deal" | "activity" | "personal_note"
): void {
  if (!canReadRecord(user, recordOwnerId, recordType)) {
    throw new Error("Insufficient permissions to read this record");
  }
}

export function assertCanWrite(
  user: UserContext,
  recordOwnerId: string | null | undefined
): void {
  if (!canWriteRecord(user, recordOwnerId)) {
    throw new Error("Insufficient permissions to write this record");
  }
}

export function assertCanDelete(user: UserContext): void {
  if (!canDeleteRecord(user)) {
    throw new Error("Insufficient permissions to delete records");
  }
}

export function assertCanAccessMetrics(
  user: UserContext,
  metricsType: "personal" | "all"
): void {
  if (!canAccessMetrics(user, metricsType)) {
    throw new Error("Insufficient permissions to access these metrics");
  }
}

