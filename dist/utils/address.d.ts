/**
 * Address autocomplete utilities
 * Integrates with address autocomplete services
 */
export interface AddressSuggestion {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    formattedAddress: string;
}
export interface AddressAutocompleteOptions {
    apiKey?: string;
    country?: string;
    language?: string;
}
/**
 * Uses Google Places API for address autocomplete
 * Requires Google Places API key
 */
export declare function getAddressSuggestions(query: string, options?: AddressAutocompleteOptions): Promise<AddressSuggestion[]>;
/**
 * Formats a full address string from address components
 */
export declare function formatFullAddress(address: {
    address1?: string | null;
    address2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
}): string;
//# sourceMappingURL=address.d.ts.map