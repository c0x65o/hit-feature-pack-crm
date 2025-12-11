/**
 * Webhook Service for CRM
 *
 * Handles webhook delivery with async processing and retry logic
 */
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
export declare function sendWebhook(event: WebhookEvent, options?: {
    customerId?: string;
    db?: any;
    webhookUrl?: string;
}): Promise<void>;
/**
 * Trigger webhook for deal closed won
 */
export declare function triggerDealClosedWon(dealId: string, dealData: any, options?: {
    customerId?: string;
    db?: any;
    webhookUrl?: string;
}): Promise<void>;
/**
 * Trigger webhook for contact created
 */
export declare function triggerContactCreated(contactId: string, contactData: any, options?: {
    customerId?: string;
    db?: any;
    webhookUrl?: string;
}): Promise<void>;
//# sourceMappingURL=webhooks.d.ts.map