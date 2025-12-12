'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useUi } from '@hit/ui-kit';
/**
 * DateInput - HTML5 date input with proper ISO date conversions
 * Accepts Date objects, ISO strings, or null/undefined
 * Always outputs ISO date string (YYYY-MM-DD) or null
 */
export function DateInput({ label, value, onChange, placeholder, error, required = false, disabled = false, min, max, }) {
    const { Input } = useUi();
    const [dateValue, setDateValue] = useState('');
    // Convert value to YYYY-MM-DD format for HTML5 date input
    useEffect(() => {
        if (value === null || value === undefined || value === '') {
            setDateValue('');
        }
        else {
            try {
                const date = value instanceof Date ? value : new Date(value);
                if (!isNaN(date.getTime())) {
                    // Format as YYYY-MM-DD for HTML5 date input
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    setDateValue(`${year}-${month}-${day}`);
                }
                else {
                    setDateValue('');
                }
            }
            catch {
                setDateValue('');
            }
        }
    }, [value]);
    const handleChange = (inputValue) => {
        setDateValue(inputValue);
        if (inputValue === '') {
            onChange(null);
            return;
        }
        // Validate the date string format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (dateRegex.test(inputValue)) {
            // HTML5 date input already provides YYYY-MM-DD format
            onChange(inputValue);
        }
        else {
            // Invalid format, but keep the input value for user to fix
            onChange(null);
        }
    };
    return (_jsx(Input, { label: label, type: "date", value: dateValue, onChange: handleChange, placeholder: placeholder, error: error, required: required, disabled: disabled, min: min, max: max }));
}
//# sourceMappingURL=DateInput.js.map