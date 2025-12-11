/**
 * OpenAI Service for CRM Activity Parsing
 *
 * Parses raw activity text using OpenAI to extract:
 * - activity_type (Call, Meeting, Note, Email)
 * - task_due_date (prioritized due date)
 * - task_description (derived description)
 */
export interface ActivityParseResult {
    activityType: "Call" | "Meeting" | "Note" | "Email" | null;
    taskDueDate: Date | null;
    taskDescription: string | null;
}
export interface ActivityParseOptions {
    customerId?: string;
    db?: any;
    openaiApiKey?: string;
}
/**
 * Parse activity text using OpenAI
 *
 * @param rawNoteText - The raw activity text to parse
 * @param options - Options including customerId, db instance, or direct API key
 * @returns Structured parse result with activity_type, task_due_date, and task_description
 */
export declare function parseActivityText(rawNoteText: string, options?: ActivityParseOptions): Promise<ActivityParseResult>;
/**
 * Update last used timestamp for OpenAI key
 */
export declare function updateOpenaiKeyUsage(customerId: string, db: any): Promise<void>;
//# sourceMappingURL=openai.d.ts.map