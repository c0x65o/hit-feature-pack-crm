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
export function formatPhoneNumber(phone: string | null | undefined, countryCode?: string | null): string {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  if (!digits) return phone; // Return original if no digits found
  
  // Default to US formatting if no country code provided
  const country = countryCode?.toUpperCase() || 'US';
  
  switch (country) {
    case 'US':
    case 'CA':
      // US/Canada: (XXX) XXX-XXXX
      if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      } else if (digits.length === 11 && digits[0] === '1') {
        // With country code
        return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
      }
      break;
    
    case 'GB':
      // UK: +44 XXXX XXXXXX
      if (digits.length === 10) {
        return `+44 ${digits.slice(0, 4)} ${digits.slice(4)}`;
      } else if (digits.length === 11 && digits[0] === '0') {
        return `+44 ${digits.slice(1, 5)} ${digits.slice(5)}`;
      }
      break;
    
    case 'AU':
      // Australia: +61 X XXXX XXXX
      if (digits.length === 9) {
        return `+61 ${digits[0]} ${digits.slice(1, 5)} ${digits.slice(5)}`;
      } else if (digits.length === 10 && digits[0] === '0') {
        return `+61 ${digits.slice(1, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
      }
      break;
    
    case 'DE':
      // Germany: +49 XXX XXXXXXX
      if (digits.length >= 10) {
        return `+49 ${digits.slice(0, 3)} ${digits.slice(3)}`;
      }
      break;
    
    case 'FR':
      // France: +33 X XX XX XX XX
      if (digits.length === 9) {
        return `+33 ${digits[0]} ${digits.slice(1, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
      }
      break;
    
    default:
      // Generic international format: +XX XXX XXX XXXX
      if (digits.length >= 10) {
        // Try to detect country code
        if (digits.length > 10) {
          const countryCodeLength = digits.length - 10;
          const countryCode = digits.slice(0, countryCodeLength);
          const localNumber = digits.slice(countryCodeLength);
          return `+${countryCode} ${localNumber.slice(0, 3)} ${localNumber.slice(3, 6)} ${localNumber.slice(6)}`;
        }
        // No country code, format as local
        return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
      }
  }
  
  // Return original if we can't format it
  return phone;
}

/**
 * Validates a phone number format
 * @param phone - Phone number string
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns true if phone number appears valid
 */
export function validatePhoneNumber(phone: string | null | undefined, countryCode?: string | null): boolean {
  if (!phone) return true; // Empty is valid (optional field)
  
  const digits = phone.replace(/\D/g, '');
  
  // Must have at least 10 digits for most countries
  if (digits.length < 10) return false;
  
  // Maximum reasonable length (15 digits is ITU-T E.164 max)
  if (digits.length > 15) return false;
  
  return true;
}

/**
 * Normalizes a phone number to digits only
 * @param phone - Phone number string
 * @returns Phone number with only digits
 */
export function normalizePhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

