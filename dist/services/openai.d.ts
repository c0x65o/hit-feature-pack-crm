/**
 * OpenAI Service for CRM Activity Parsing
 *
 * Parses raw activity text using OpenAI to extract:
 * - activity_type (Call, Meeting, Note, Email)
 * - task_due_date (prioritized due date)
 * - task_description (derived description)
 *
 * Uses OPENAI_API_KEY environment variable if available.
 * Uses dynamic import to avoid bundling openai package when not needed.
 */
export interface ActivityParseResult {
    activityType: "Call" | "Meeting" | "Note" | "Email" | null;
    taskDueDate: Date | null;
    taskDescription: string | null;
}
/**
 * Parse activity text using OpenAI
 *
 * @param rawNoteText - The raw activity text to parse
 * @returns Structured parse result with activity_type, task_due_date, and task_description
 */
export declare function parseActivityText(rawNoteText: string): Promise<ActivityParseResult>;
//# sourceMappingURL=openai.d.ts.map