'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { useCrmDeals } from '../hooks/useCrmDeals';
import { TrendingUp } from 'lucide-react';
export function DealAutocomplete({ value, onChange, label = 'Related Deal', placeholder = 'Search for a deal...', disabled = false, }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);
    const timeoutRef = useRef(null);
    // Fetch deal details when value changes
    useEffect(() => {
        if (value && !selectedDeal) {
            const fetchDeal = async () => {
                try {
                    const res = await fetch(`/api/crm/deals/${value}`);
                    if (res.ok) {
                        const deal = await res.json();
                        setSelectedDeal({ id: deal.id, name: deal.dealName || 'Unknown Deal' });
                        setSearchQuery(deal.dealName || '');
                    }
                }
                catch (error) {
                    console.error('Error fetching deal:', error);
                }
            };
            fetchDeal();
        }
        else if (!value) {
            setSelectedDeal(null);
            setSearchQuery('');
        }
    }, [value, selectedDeal]);
    const { data: dealsData, loading } = useCrmDeals({
        search: searchQuery,
        pageSize: 10,
    });
    const deals = dealsData?.items || [];
    // Debounce search
    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (searchQuery.length < 2 && !selectedDeal) {
            setShowSuggestions(false);
            setHighlightedIndex(-1);
            return;
        }
        if (selectedDeal && searchQuery === selectedDeal.name) {
            setShowSuggestions(false);
            setHighlightedIndex(-1);
            return;
        }
        timeoutRef.current = setTimeout(() => {
            setShowSuggestions(true);
            setHighlightedIndex(-1);
        }, 300);
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [searchQuery, selectedDeal]);
    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowSuggestions(false);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleSelectDeal = (deal) => {
        setSelectedDeal(deal);
        setSearchQuery(deal.name);
        onChange(deal.id);
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
    };
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setSearchQuery(newValue);
        if (!newValue) {
            setSelectedDeal(null);
            onChange('');
        }
    };
    const handleClear = () => {
        setSearchQuery('');
        setSelectedDeal(null);
        onChange('');
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        inputRef.current?.focus();
    };
    // Keyboard navigation
    const handleKeyDown = (e) => {
        if (!showSuggestions || deals.length === 0) {
            if (e.key === 'Enter' && selectedDeal) {
                // Allow form submission if deal is selected
                return;
            }
            return;
        }
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((prev) => prev < deals.length - 1 ? prev + 1 : prev);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < deals.length) {
                    handleSelectDeal({
                        id: deals[highlightedIndex].id,
                        name: deals[highlightedIndex].dealName
                    });
                }
                break;
            case 'Escape':
                e.preventDefault();
                setShowSuggestions(false);
                setHighlightedIndex(-1);
                inputRef.current?.blur();
                break;
        }
    };
    // Scroll highlighted item into view
    useEffect(() => {
        if (highlightedIndex >= 0 && suggestionsRef.current) {
            const item = suggestionsRef.current.children[highlightedIndex];
            if (item) {
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [highlightedIndex]);
    const formatCurrency = (amount) => {
        if (!amount)
            return '';
        const num = parseFloat(amount.toString());
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num);
    };
    return (_jsxs("div", { ref: containerRef, className: "relative", children: [_jsxs("div", { className: "relative", children: [selectedDeal && (_jsx("button", { type: "button", onClick: handleClear, className: "absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10", style: { marginTop: '12px' }, "aria-label": "Clear selection", children: "\u00D7" })), _jsxs("div", { children: [label && (_jsx("label", { style: {
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: 'var(--hit-foreground)',
                                    marginBottom: '8px',
                                }, children: label })), _jsx("input", { ref: inputRef, type: "text", value: searchQuery, onChange: handleInputChange, onKeyDown: handleKeyDown, placeholder: placeholder, disabled: disabled, "aria-autocomplete": "list", "aria-expanded": showSuggestions, "aria-controls": "deal-autocomplete-list", "aria-activedescendant": highlightedIndex >= 0 ? `deal-option-${highlightedIndex}` : undefined, style: {
                                    width: '100%',
                                    padding: '8px 12px',
                                    backgroundColor: 'var(--hit-input-bg)',
                                    border: '1px solid var(--hit-input-border)',
                                    borderRadius: '6px',
                                    color: 'var(--hit-foreground)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    opacity: disabled ? 0.5 : 1,
                                    cursor: disabled ? 'not-allowed' : 'text',
                                    boxSizing: 'border-box',
                                } })] })] }), showSuggestions && !selectedDeal && (_jsx("div", { ref: suggestionsRef, id: "deal-autocomplete-list", role: "listbox", "aria-label": "Deal suggestions", style: {
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
                }, children: loading ? (_jsx("div", { role: "status", "aria-live": "polite", style: { padding: '12px 16px', textAlign: 'center', color: 'var(--text-muted, #888)' }, children: "Searching..." })) : deals.length === 0 ? (_jsx("div", { role: "status", style: { padding: '12px 16px', textAlign: 'center', color: 'var(--text-muted, #888)' }, children: "No deals found" })) : (deals.map((deal, index) => (_jsxs("div", { id: `deal-option-${index}`, role: "option", "aria-selected": highlightedIndex === index, onClick: () => handleSelectDeal({ id: deal.id, name: deal.dealName }), style: {
                        padding: '12px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        borderBottom: index < deals.length - 1 ? '1px solid var(--border-default, #333)' : 'none',
                        backgroundColor: highlightedIndex === index ? 'var(--bg-hover, #2a2a2a)' : 'transparent',
                    }, onMouseEnter: () => setHighlightedIndex(index), onMouseLeave: () => setHighlightedIndex(-1), children: [_jsx(TrendingUp, { size: 16, style: { color: 'var(--text-muted, #888)' } }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("div", { style: { fontWeight: 500, marginBottom: '2px' }, children: deal.dealName }), deal.amount && (_jsx("div", { style: { fontSize: '12px', color: 'var(--text-muted, #888)' }, children: formatCurrency(deal.amount) }))] })] }, deal.id)))) }))] }));
}
//# sourceMappingURL=DealAutocomplete.js.map