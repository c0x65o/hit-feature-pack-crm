interface AddressAutocompleteProps {
    address1: string;
    address2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    onAddressChange: (address: {
        address1: string;
        address2: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    }) => void;
    apiKey?: string;
    disabled?: boolean;
}
export declare function AddressAutocomplete({ address1, address2, city, state, postalCode, country, onAddressChange, apiKey, disabled, }: AddressAutocompleteProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=AddressAutocomplete.d.ts.map