'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
/**
 * DateInput - HTML5 date input with proper ISO date conversions
 * Accepts Date objects, ISO strings, or null/undefined
 * Always outputs ISO date string (YYYY-MM-DD) or null
 */
export function DateInput({ label, value, onChange, placeholder, error, required = false, disabled = false, min, max, }) {
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
    const handleChange = (e) => {
        const inputValue = e.target.value;
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
    return (_jsxs("div", { children: [label && (_jsxs("label", { style: {
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--hit-foreground)',
                    marginBottom: '8px',
                }, children: [label, required && _jsx("span", { style: { color: 'var(--hit-error)', marginLeft: '4px' }, children: "*" })] })), _jsx("input", { type: "date", value: dateValue, onChange: handleChange, placeholder: placeholder, required: required, disabled: disabled, min: min, max: max, style: {
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: 'var(--hit-input-bg)',
                    border: `1px solid ${error ? 'var(--hit-error)' : 'var(--hit-input-border)'}`,
                    borderRadius: '6px',
                    color: 'var(--hit-foreground)',
                    fontSize: '14px',
                    outline: 'none',
                    opacity: disabled ? 0.5 : 1,
                    cursor: disabled ? 'not-allowed' : 'text',
                    boxSizing: 'border-box',
                } }), error && (_jsx("p", { style: {
                    marginTop: '4px',
                    fontSize: '12px',
                    color: 'var(--hit-error)',
                }, children: error }))] }));
}
//# sourceMappingURL=DateInput.js.map