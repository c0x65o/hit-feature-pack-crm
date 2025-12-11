'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from 'react';
import { Search, User, Building, TrendingUp } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useGlobalSearch } from '../hooks/useGlobalSearch';
export function GlobalSearch({ onSelect }) {
    const { Input, Card, Badge, Spinner } = useUi();
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const { data: results, loading } = useGlobalSearch(debouncedQuery);
    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);
    const handleSelect = useCallback((type, id) => {
        if (onSelect) {
            onSelect(type, id);
        }
        else if (typeof window !== 'undefined') {
            const path = `/crm/${type === 'contact' ? 'contacts' : type === 'company' ? 'companies' : 'deals'}/${id}`;
            window.location.href = path;
        }
    }, [onSelect]);
    const getIcon = (type) => {
        switch (type) {
            case 'contact':
                return _jsx(User, { size: 16 });
            case 'company':
                return _jsx(Building, { size: 16 });
            case 'deal':
                return _jsx(TrendingUp, { size: 16 });
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400", size: 20 }), _jsx("div", { className: "pl-10 w-full", children: _jsx(Input, { type: "search", placeholder: "Search contacts, companies, deals...", value: query, onChange: setQuery }) })] }), query && (_jsx("div", { className: "absolute top-full mt-2 w-full z-50 shadow-lg", children: _jsx(Card, { children: loading ? (_jsx("div", { className: "p-4 flex justify-center", children: _jsx(Spinner, {}) })) : results && results.length > 0 ? (_jsx("div", { children: ['contact', 'company', 'deal'].map((type) => {
                            const typeResults = results.filter((r) => r.type === type);
                            if (typeResults.length === 0)
                                return null;
                            return (_jsxs("div", { className: "mb-4 last:mb-0", children: [_jsx("div", { className: "px-4 py-2 text-xs font-semibold text-gray-500 uppercase", children: type === 'contact' ? 'Contacts' : type === 'company' ? 'Companies' : 'Deals' }), _jsx("ul", { children: typeResults.map((result) => (_jsx("li", { className: "cursor-pointer hover:bg-gray-50 px-4 py-2", onClick: () => handleSelect(type, result.id), children: _jsxs("div", { className: "flex items-center gap-3 flex-1", children: [getIcon(type), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium", children: result.name }), result.subtitle && (_jsx("div", { className: "text-sm text-gray-500", children: result.subtitle }))] }), result.badge && (_jsx(Badge, { variant: "default", children: result.badge }))] }) }, result.id))) })] }, type));
                        }) })) : (_jsx("div", { className: "p-4 text-center text-gray-500", children: "No results found" })) }) }))] }));
}
//# sourceMappingURL=GlobalSearch.js.map