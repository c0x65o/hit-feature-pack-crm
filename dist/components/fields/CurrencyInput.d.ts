interface CurrencyInputProps {
    label?: string;
    value: number | string | null | undefined;
    onChange: (value: number | null) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    currency?: string;
}
/**
 * CurrencyInput - Formats currency as user types, stores numeric value
 * Handles empty/null values gracefully
 */
export declare function CurrencyInput({ label, value, onChange, placeholder, error, required, disabled, currency, }: CurrencyInputProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CurrencyInput.d.ts.map