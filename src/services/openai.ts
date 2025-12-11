/**
 * OpenAI Service for CRM Activity Parsing
 * 
 * Parses raw activity text using OpenAI to extract:
 * - activity_type (Call, Meeting, Note, Email)
 * - task_due_date (prioritized due date)
 * - task_description (derived description)
 * 
 * Uses OPENAI_API_KEY environment variable if available.
 */

import OpenAI from "openai";

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
export async function parseActivityText(
  rawNoteText: string
): Promise<ActivityParseResult> {
  // Get OpenAI API key from environment variable
  const apiKey = process.env.OPENAI_API_KEY;

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
          content:
            "You are a CRM activity parser. Extract structured information from activity text. Always return valid JSON.",
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
    let parsed: any;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : content;
      parsed = JSON.parse(jsonText.trim());
    } catch (parseError) {
      // If JSON parsing fails, try to extract fields manually
      console.warn("Failed to parse OpenAI JSON response, attempting manual extraction", parseError);
      parsed = {};
    }

    // Validate and normalize activity type
    let activityType: "Call" | "Meeting" | "Note" | "Email" | null = null;
    const typeStr = parsed.activityType?.toString().trim();
    if (typeStr && ["Call", "Meeting", "Note", "Email"].includes(typeStr)) {
      activityType = typeStr as "Call" | "Meeting" | "Note" | "Email";
    }

    // Parse task due date
    let taskDueDate: Date | null = null;
    if (parsed.taskDueDate) {
      try {
        taskDueDate = new Date(parsed.taskDueDate);
        // Validate date
        if (isNaN(taskDueDate.getTime())) {
          taskDueDate = null;
        }
      } catch (dateError) {
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
  } catch (error) {
    // Graceful fallback on error
    console.error("OpenAI activity parsing failed", error);
    return {
      activityType: null,
      taskDueDate: null,
      taskDescription: null,
    };
  }
}


