'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmContacts } from '../hooks/useCrmContacts';
import { User } from 'lucide-react';
export function ContactAutocomplete({ value, onChange, label = 'Related Contact', placeholder = 'Search for a contact...', disabled = false, }) {
    const { Input } = useUi();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const containerRef = useRef(null);
    const timeoutRef = useRef(null);
    // Fetch contact details when value changes
    useEffect(() => {
        if (value && !selectedContact) {
            const fetchContact = async () => {
                try {
                    const res = await fetch(`/api/crm/contacts/${value}`);
                    if (res.ok) {
                        const contact = await res.json();
                        setSelectedContact({ id: contact.id, name: contact.name || 'Unknown Contact' });
                        setSearchQuery(contact.name || '');
                    }
                }
                catch (error) {
                    console.error('Error fetching contact:', error);
                }
            };
            fetchContact();
        }
        else if (!value) {
            setSelectedContact(null);
            setSearchQuery('');
        }
    }, [value, selectedContact]);
    const { data: contactsData, loading } = useCrmContacts({
        search: searchQuery,
        pageSize: 10,
    });
    const contacts = contactsData?.items || [];
    // Debounce search
    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (searchQuery.length < 2 && !selectedContact) {
            setShowSuggestions(false);
            return;
        }
        if (selectedContact && searchQuery === selectedContact.name) {
            setShowSuggestions(false);
            return;
        }
        timeoutRef.current = setTimeout(() => {
            setShowSuggestions(true);
        }, 300);
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [searchQuery, selectedContact]);
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
    const handleSelectContact = (contact) => {
        setSelectedContact(contact);
        setSearchQuery(contact.name);
        onChange(contact.id);
        setShowSuggestions(false);
    };
    const handleInputChange = (newValue) => {
        setSearchQuery(newValue);
        if (!newValue) {
            setSelectedContact(null);
            onChange('');
        }
    };
    const handleClear = () => {
        setSearchQuery('');
        setSelectedContact(null);
        onChange('');
        setShowSuggestions(false);
    };
    return (_jsxs("div", { ref: containerRef, className: "relative", children: [_jsxs("div", { className: "relative", children: [selectedContact && (_jsx("button", { type: "button", onClick: handleClear, className: "absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10", style: { marginTop: '12px' }, children: "\u00D7" })), _jsx(Input, { label: label, value: searchQuery, onChange: handleInputChange, placeholder: placeholder, disabled: disabled })] }), showSuggestions && !selectedContact && (_jsx("div", { style: {
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
                }, children: loading ? (_jsx("div", { style: { padding: '12px 16px', textAlign: 'center', color: 'var(--text-muted, #888)' }, children: "Searching..." })) : contacts.length === 0 ? (_jsx("div", { style: { padding: '12px 16px', textAlign: 'center', color: 'var(--text-muted, #888)' }, children: "No contacts found" })) : (contacts.map((contact) => (_jsxs("div", { onClick: () => handleSelectContact({ id: contact.id, name: contact.name }), style: {
                        padding: '12px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        borderBottom: contacts.indexOf(contact) < contacts.length - 1 ? '1px solid var(--border-default, #333)' : 'none',
                    }, onMouseEnter: (e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-hover, #2a2a2a)';
                    }, onMouseLeave: (e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }, children: [_jsx(User, { size: 16, style: { color: 'var(--text-muted, #888)' } }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("div", { style: { fontWeight: 500, marginBottom: '2px' }, children: contact.name }), contact.email && (_jsx("div", { style: { fontSize: '12px', color: 'var(--text-muted, #888)' }, children: contact.email }))] })] }, contact.id)))) }))] }));
}
//# sourceMappingURL=ContactAutocomplete.js.map