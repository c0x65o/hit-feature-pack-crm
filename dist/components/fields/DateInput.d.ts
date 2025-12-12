interface DateInputProps {
    label?: string;
    value: string | Date | null | undefined;
    onChange: (value: string | null) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    min?: string;
    max?: string;
}
/**
 * DateInput - HTML5 date input with proper ISO date conversions
 * Accepts Date objects, ISO strings, or null/undefined
 * Always outputs ISO date string (YYYY-MM-DD) or null
 */
export declare function DateInput({ label, value, onChange, placeholder, error, required, disabled, min, max, }: DateInputProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=DateInput.d.ts.map