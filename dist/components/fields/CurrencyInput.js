'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useUi } from '@hit/ui-kit';
/**
 * CurrencyInput - Formats currency as user types, stores numeric value
 * Handles empty/null values gracefully
 */
export function CurrencyInput({ label, value, onChange, placeholder = '0.00', error, required = false, disabled = false, currency = 'USD', }) {
    const { Input } = useUi();
    const [displayValue, setDisplayValue] = useState('');
    // Convert numeric value to display string
    useEffect(() => {
        if (value === null || value === undefined || value === '') {
            setDisplayValue('');
        }
        else {
            const num = typeof value === 'string' ? parseFloat(value) : value;
            if (isNaN(num)) {
                setDisplayValue('');
            }
            else {
                // Format for display (no currency symbol, just number with decimals)
                setDisplayValue(num.toFixed(2));
            }
        }
    }, [value]);
    const handleChange = (inputValue) => {
        setDisplayValue(inputValue);
        // Remove any non-numeric characters except decimal point
        const cleaned = inputValue.replace(/[^0-9.]/g, '');
        // Handle empty input
        if (cleaned === '' || cleaned === '.') {
            onChange(null);
            return;
        }
        // Parse the number
        const num = parseFloat(cleaned);
        if (!isNaN(num)) {
            onChange(num);
        }
        else {
            onChange(null);
        }
    };
    const handleBlur = () => {
        // Format on blur to ensure consistent display
        if (value !== null && value !== undefined && value !== '') {
            const num = typeof value === 'string' ? parseFloat(value) : value;
            if (!isNaN(num)) {
                setDisplayValue(num.toFixed(2));
            }
        }
    };
    return (_jsxs("div", { children: [_jsx(Input, { label: label, type: "text", value: displayValue, onChange: handleChange, onBlur: handleBlur, placeholder: placeholder, error: error, required: required, disabled: disabled }), value !== null && value !== undefined && value !== '' && (_jsx("div", { style: { fontSize: '12px', color: 'var(--hit-muted-foreground)', marginTop: '4px' }, children: new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(typeof value === 'string' ? parseFloat(value) : value) }))] }));
}
//# sourceMappingURL=CurrencyInput.js.map