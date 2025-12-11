/**
 * Webhook Service for CRM
 * 
 * Handles webhook delivery with async processing and retry logic
 */

import { eq, and } from "drizzle-orm";
import { crmWebhookConfigs } from "../schema/crm";
import type { DrizzleD1Database } from "drizzle-orm/d1";

export interface WebhookEvent {
  type: 'deal_closed_won' | 'contact_created';
  data: any;
  timestamp: string;
}

export interface WebhookPayload {
  event: WebhookEvent;
  source: 'crm';
  version: '1.0';
}

/**
 * Send webhook notification
 * 
 * @param event - The webhook event to send
 * @param options - Options including customerId and db instance
 */
export async function sendWebhook(
  event: WebhookEvent,
  options: {
    customerId?: string;
    db?: any; // Drizzle database instance
    webhookUrl?: string; // Optional direct webhook URL
  } = {}
): Promise<void> {
  const { customerId, db, webhookUrl } = options;

  // Get webhook configuration
  let url: string | null = null;
  let secret: string | null = null;

  if (webhookUrl) {
    // Use provided URL directly
    url = webhookUrl;
  } else if (customerId && db) {
    // Retrieve customer-specific webhook config from database
    const config = await db
      .select()
      .from(crmWebhookConfigs)
      .where(
        and(
          eq(crmWebhookConfigs.customerId, customerId),
          eq(crmWebhookConfigs.isEnabled, true)
        )
      )
      .limit(1);

    if (config.length > 0) {
      url = config[0].webhookUrl;
      secret = config[0].secret || null;

      // Check if this event type is enabled
      const events = config[0].events as string[] | null;
      if (events && !events.includes(event.type)) {
        // Event type not enabled for this webhook
        return;
      }
    }
  }

  if (!url) {
    // No webhook configured
    return;
  }

  // Build payload
  const payload: WebhookPayload = {
    event,
    source: 'crm',
    version: '1.0',
  };

  // Send webhook asynchronously (don't wait for response)
  sendWebhookAsync(url, payload, secret).catch((error) => {
    console.error('Webhook delivery failed', error);
    // In production, you might want to queue this for retry
  });
}

/**
 * Send webhook asynchronously with retry logic
 */
async function sendWebhookAsync(
  url: string,
  payload: WebhookPayload,
  secret: string | null,
  retries = 3
): Promise<void> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'HIT-CRM-Webhook/1.0',
  };

  // Add webhook signature if secret is provided
  if (secret) {
    // In production, use HMAC-SHA256 to sign the payload
    // For now, we'll add a simple header
    headers['X-Webhook-Secret'] = secret;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        // Timeout after 10 seconds
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        // Success
        return;
      }

      // Non-2xx response - retry if not final attempt
      if (attempt < retries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff, max 10s
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw new Error(`Webhook returned status ${response.status}`);
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }

      // Retry with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

/**
 * Trigger webhook for deal closed won
 */
export async function triggerDealClosedWon(
  dealId: string,
  dealData: any,
  options: {
    customerId?: string;
    db?: any;
    webhookUrl?: string;
  } = {}
): Promise<void> {
  await sendWebhook(
    {
      type: 'deal_closed_won',
      data: {
        dealId,
        dealName: dealData.dealName,
        amount: dealData.amount,
        companyId: dealData.companyId,
        contactId: dealData.primaryContactId,
      },
      timestamp: new Date().toISOString(),
    },
    options
  );
}

/**
 * Trigger webhook for contact created
 */
export async function triggerContactCreated(
  contactId: string,
  contactData: any,
  options: {
    customerId?: string;
    db?: any;
    webhookUrl?: string;
  } = {}
): Promise<void> {
  await sendWebhook(
    {
      type: 'contact_created',
      data: {
        contactId,
        name: contactData.name,
        email: contactData.email,
        companyId: contactData.companyId,
      },
      timestamp: new Date().toISOString(),
    },
    options
  );
}

