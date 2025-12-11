/**
 * Phone number formatting utilities
 * Formats phone numbers based on country code
 */
/**
 * Formats a phone number based on the country code
 * @param phone - Raw phone number string
 * @param countryCode - ISO 3166-1 alpha-2 country code (e.g., 'US', 'CA', 'GB')
 * @returns Formatted phone number string
 */
export declare function formatPhoneNumber(phone: string | null | undefined, countryCode?: string | null): string;
/**
 * Validates a phone number format
 * @param phone - Phone number string
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns true if phone number appears valid
 */
export declare function validatePhoneNumber(phone: string | null | undefined, countryCode?: string | null): boolean;
/**
 * Normalizes a phone number to digits only
 * @param phone - Phone number string
 * @returns Phone number with only digits
 */
export declare function normalizePhoneNumber(phone: string | null | undefined): string;
//# sourceMappingURL=phone.d.ts.map