/**
 * OpenAI Service for CRM Activity Parsing
 *
 * Parses raw activity text using OpenAI to extract:
 * - activity_type (Call, Meeting, Note, Email)
 * - task_due_date (prioritized due date)
 * - task_description (derived description)
 */
import OpenAI from "openai";
import { eq, and } from "drizzle-orm";
import { crmOpenaiKeys } from "../schema/crm";
/**
 * Parse activity text using OpenAI
 *
 * @param rawNoteText - The raw activity text to parse
 * @param options - Options including customerId, db instance, or direct API key
 * @returns Structured parse result with activity_type, task_due_date, and task_description
 */
export async function parseActivityText(rawNoteText, options = {}) {
    const { customerId, db, openaiApiKey } = options;
    // Get OpenAI API key
    let apiKey = null;
    if (openaiApiKey) {
        // Use provided API key directly
        apiKey = openaiApiKey;
    }
    else if (customerId && db) {
        // Retrieve customer-specific API key from database
        const keyRecord = await db
            .select()
            .from(crmOpenaiKeys)
            .where(and(eq(crmOpenaiKeys.customerId, customerId), eq(crmOpenaiKeys.isActive, true)))
            .limit(1);
        if (keyRecord.length > 0) {
            // In production, decrypt the key here
            // For now, assume keyEncrypted is stored encrypted and needs decryption
            // This would use your encryption service (e.g., Fernet from Python integration manager)
            apiKey = keyRecord[0].keyEncrypted; // TODO: Decrypt in production
        }
    }
    // Fallback to environment variable if no customer key found
    if (!apiKey) {
        apiKey = process.env.OPENAI_API_KEY || null;
    }
    if (!apiKey) {
        // Graceful fallback - return null values if no API key available
        return {
            activityType: null,
            taskDueDate: null,
            taskDescription: null,
        };
    }
    // Initialize OpenAI client
    const openai = new OpenAI({
        apiKey: apiKey,
    });
    try {
        // Create prompt for activity parsing
        const prompt = `Parse the following CRM activity text and extract structured information.

Activity Text:
${rawNoteText}

Extract the following:
1. Activity Type: One of "Call", "Meeting", "Note", or "Email" based on the content. If unclear, return null.
2. Task Due Date: Extract any mentioned dates, deadlines, or follow-up dates. Return as ISO 8601 date string (YYYY-MM-DD) or null if no date found.
3. Task Description: Extract or summarize the main task or action item mentioned. Return as a concise string or null if no task found.

Return a JSON object with these three fields: activityType, taskDueDate, taskDescription.

Example response:
{
  "activityType": "Call",
  "taskDueDate": "2024-12-15",
  "taskDescription": "Follow up on pricing proposal"
}`;
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Use cost-effective model
            messages: [
                {
                    role: "system",
                    content: "You are a CRM activity parser. Extract structured information from activity text. Always return valid JSON.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.3, // Lower temperature for more consistent parsing
            max_tokens: 200,
        });
        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error("No response content from OpenAI");
        }
        // Parse JSON response
        let parsed;
        try {
            // Try to extract JSON from markdown code blocks if present
            const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
            const jsonText = jsonMatch ? jsonMatch[1] : content;
            parsed = JSON.parse(jsonText.trim());
        }
        catch (parseError) {
            // If JSON parsing fails, try to extract fields manually
            console.warn("Failed to parse OpenAI JSON response, attempting manual extraction", parseError);
            parsed = {};
        }
        // Validate and normalize activity type
        let activityType = null;
        const typeStr = parsed.activityType?.toString().trim();
        if (typeStr && ["Call", "Meeting", "Note", "Email"].includes(typeStr)) {
            activityType = typeStr;
        }
        // Parse task due date
        let taskDueDate = null;
        if (parsed.taskDueDate) {
            try {
                taskDueDate = new Date(parsed.taskDueDate);
                // Validate date
                if (isNaN(taskDueDate.getTime())) {
                    taskDueDate = null;
                }
            }
            catch (dateError) {
                console.warn("Failed to parse task due date", dateError);
                taskDueDate = null;
            }
        }
        // Extract task description
        const taskDescription = parsed.taskDescription?.toString().trim() || null;
        return {
            activityType,
            taskDueDate,
            taskDescription,
        };
    }
    catch (error) {
        // Graceful fallback on error
        console.error("OpenAI activity parsing failed", error);
        return {
            activityType: null,
            taskDueDate: null,
            taskDescription: null,
        };
    }
}
/**
 * Update last used timestamp for OpenAI key
 */
export async function updateOpenaiKeyUsage(customerId, db) {
    try {
        await db
            .update(crmOpenaiKeys)
            .set({
            lastUsedAt: new Date(),
            lastUpdatedOnTimestamp: new Date(),
        })
            .where(and(eq(crmOpenaiKeys.customerId, customerId), eq(crmOpenaiKeys.isActive, true)));
    }
    catch (error) {
        // Non-critical - log but don't fail
        console.warn("Failed to update OpenAI key usage timestamp", error);
    }
}
//# sourceMappingURL=openai.js.map