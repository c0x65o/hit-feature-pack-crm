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
export async function getAddressSuggestions(
  query: string,
  options: AddressAutocompleteOptions = {}
): Promise<AddressSuggestion[]> {
  const { apiKey, country, language = 'en' } = options;
  
  if (!apiKey) {
    console.warn('Google Places API key not provided. Address autocomplete disabled.');
    return [];
  }
  
  try {
    // Use Google Places Autocomplete API
    const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
    url.searchParams.set('input', query);
    url.searchParams.set('key', apiKey);
    url.searchParams.set('language', language);
    if (country) {
      url.searchParams.set('components', `country:${country}`);
    }
    url.searchParams.set('types', 'address');
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status, data.error_message);
      return [];
    }
    
    // Get place details for each suggestion
    const suggestions: AddressSuggestion[] = [];
    
    for (const prediction of data.predictions || []) {
      try {
        const details = await getPlaceDetails(prediction.place_id, apiKey);
        if (details) {
          suggestions.push(details);
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    }
    
    return suggestions;
  } catch (error) {
    console.error('Error fetching address suggestions:', error);
    return [];
  }
}

/**
 * Gets detailed address information from a Google Place ID
 */
async function getPlaceDetails(placeId: string, apiKey: string): Promise<AddressSuggestion | null> {
  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    url.searchParams.set('place_id', placeId);
    url.searchParams.set('key', apiKey);
    url.searchParams.set('fields', 'address_components,formatted_address');
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    if (data.status !== 'OK' || !data.result) {
      return null;
    }
    
    const components = data.result.address_components || [];
    const formattedAddress = data.result.formatted_address || '';
    
    // Parse address components
    const address: Partial<AddressSuggestion> = {
      formattedAddress,
      address1: '',
      address2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    };
    
    // Extract street number and route for address1
    const streetNumber = components.find((c: any) => c.types.includes('street_number'))?.long_name || '';
    const route = components.find((c: any) => c.types.includes('route'))?.long_name || '';
    address.address1 = [streetNumber, route].filter(Boolean).join(' ').trim();
    
    // Extract subpremise for address2 (apartment, suite, etc.)
    const subpremise = components.find((c: any) => c.types.includes('subpremise'))?.long_name;
    if (subpremise) {
      address.address2 = subpremise;
    }
    
    // Extract city (locality or administrative_area_level_2)
    address.city = components.find((c: any) => 
      c.types.includes('locality') || c.types.includes('administrative_area_level_2')
    )?.long_name || '';
    
    // Extract state (administrative_area_level_1)
    address.state = components.find((c: any) => 
      c.types.includes('administrative_area_level_1')
    )?.short_name || '';
    
    // Extract postal code
    address.postalCode = components.find((c: any) => 
      c.types.includes('postal_code')
    )?.long_name || '';
    
    // Extract country
    address.country = components.find((c: any) => 
      c.types.includes('country')
    )?.short_name || '';
    
    return address as AddressSuggestion;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
}

/**
 * Formats a full address string from address components
 */
export function formatFullAddress(address: {
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
}): string {
  const parts: string[] = [];
  
  if (address.address1) parts.push(address.address1);
  if (address.address2) parts.push(address.address2);
  
  const cityStateZip: string[] = [];
  if (address.city) cityStateZip.push(address.city);
  if (address.state) cityStateZip.push(address.state);
  if (address.postalCode) cityStateZip.push(address.postalCode);
  
  if (cityStateZip.length > 0) {
    parts.push(cityStateZip.join(', '));
  }
  
  if (address.country) parts.push(address.country);
  
  return parts.join('\n');
}

