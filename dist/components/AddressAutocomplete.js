'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { useUi } from '@hit/ui-kit';
import { getAddressSuggestions } from '../utils/address';
export function AddressAutocomplete({ address1, address2, city, state, postalCode, country, onAddressChange, apiKey, disabled = false, }) {
    const { Input } = useUi();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const timeoutRef = useRef(null);
    const containerRef = useRef(null);
    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    // Debounced search
    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (searchQuery.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        setIsLoading(true);
        timeoutRef.current = setTimeout(async () => {
            try {
                const results = await getAddressSuggestions(searchQuery, {
                    apiKey,
                    country: country || undefined,
                });
                setSuggestions(results);
                setShowSuggestions(results.length > 0);
            }
            catch (error) {
                console.error('Error fetching address suggestions:', error);
                setSuggestions([]);
                setShowSuggestions(false);
            }
            finally {
                setIsLoading(false);
            }
        }, 300);
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [searchQuery, apiKey, country]);
    const handleSelectSuggestion = (suggestion) => {
        onAddressChange({
            address1: suggestion.address1,
            address2: suggestion.address2 || '',
            city: suggestion.city,
            state: suggestion.state,
            postalCode: suggestion.postalCode,
            country: suggestion.country,
        });
        setSearchQuery('');
        setShowSuggestions(false);
        setSuggestions([]);
    };
    const handleAddress1Change = (value) => {
        setSearchQuery(value);
        onAddressChange({
            address1: value,
            address2,
            city,
            state,
            postalCode,
            country,
        });
    };
    return (_jsxs("div", { ref: containerRef, className: "relative", children: [_jsx(Input, { label: "Address", value: address1, onChange: handleAddress1Change, placeholder: apiKey ? "Start typing an address..." : "Street address", disabled: disabled }), showSuggestions && suggestions.length > 0 && (_jsx("div", { style: {
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    backgroundColor: 'var(--bg-elevated, #1a1a1a)',
                    border: '1px solid var(--border-default, #333)',
                    borderRadius: '8px',
                    marginTop: '4px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }, children: suggestions.map((suggestion, index) => (_jsxs("div", { onClick: () => handleSelectSuggestion(suggestion), style: {
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderBottom: index < suggestions.length - 1 ? '1px solid var(--border-default, #333)' : 'none',
                    }, onMouseEnter: (e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-hover, #2a2a2a)';
                    }, onMouseLeave: (e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }, children: [_jsx("div", { style: { fontWeight: 500, marginBottom: '4px' }, children: suggestion.formattedAddress }), _jsx("div", { style: { fontSize: '12px', color: 'var(--text-muted, #888)' }, children: [suggestion.city, suggestion.state, suggestion.postalCode].filter(Boolean).join(', ') })] }, index))) })), isLoading && (_jsx("div", { style: {
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    padding: '8px 16px',
                    fontSize: '12px',
                    color: 'var(--text-muted, #888)',
                }, children: "Searching..." }))] }));
}
//# sourceMappingURL=AddressAutocomplete.js.map