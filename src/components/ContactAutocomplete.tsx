'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmContacts } from '../hooks/useCrmContacts';
import { User } from 'lucide-react';

interface ContactAutocompleteProps {
  value: string;
  onChange: (contactId: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function ContactAutocomplete({
  value,
  onChange,
  label = 'Related Contact',
  placeholder = 'Search for a contact...',
  disabled = false,
}: ContactAutocompleteProps) {
  const { Input } = useUi();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedContact, setSelectedContact] = useState<{ id: string; name: string } | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        } catch (error) {
          console.error('Error fetching contact:', error);
        }
      };
      fetchContact();
    } else if (!value) {
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
      setHighlightedIndex(-1);
      return;
    }

    if (selectedContact && searchQuery === selectedContact.name) {
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
  }, [searchQuery, selectedContact]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectContact = (contact: { id: string; name: string }) => {
    setSelectedContact(contact);
    setSearchQuery(contact.name);
    onChange(contact.id);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current?.querySelector('input')?.blur();
  };

  const handleInputChange = (newValue: string) => {
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
    setHighlightedIndex(-1);
    inputRef.current?.querySelector('input')?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || contacts.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < contacts.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < contacts.length) {
          handleSelectContact({ id: contacts[highlightedIndex].id, name: contacts[highlightedIndex].name });
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        inputRef.current?.querySelector('input')?.blur();
        break;
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && suggestionsRef.current) {
      const item = suggestionsRef.current.children[highlightedIndex] as HTMLElement | undefined;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        {selectedContact && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
            style={{ marginTop: '12px' }}
            aria-label="Clear selection"
          >
            ×
          </button>
        )}
        <div ref={inputRef}>
          <Input
            label={label}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
            aria-controls="contact-autocomplete-list"
            aria-activedescendant={highlightedIndex >= 0 ? `contact-option-${highlightedIndex}` : undefined}
          />
        </div>
      </div>

      {showSuggestions && !selectedContact && (
        <div
          ref={suggestionsRef}
          id="contact-autocomplete-list"
          role="listbox"
          aria-label="Contact suggestions"
          style={{
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
          }}
        >
          {loading ? (
            <div role="status" aria-live="polite" style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-muted, #888)' }}>
              Searching...
            </div>
          ) : contacts.length === 0 ? (
            <div role="status" style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-muted, #888)' }}>
              No contacts found
            </div>
          ) : (
            contacts.map((contact: { id: string; name: string; email?: string }, index: number) => (
              <div
                key={contact.id}
                id={`contact-option-${index}`}
                role="option"
                aria-selected={highlightedIndex === index}
                onClick={() => handleSelectContact({ id: contact.id, name: contact.name })}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderBottom: index < contacts.length - 1 ? '1px solid var(--border-default, #333)' : 'none',
                  backgroundColor: highlightedIndex === index ? 'var(--bg-hover, #2a2a2a)' : 'transparent',
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseLeave={() => setHighlightedIndex(-1)}
              >
                <User size={16} style={{ color: 'var(--text-muted, #888)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, marginBottom: '2px' }}>{contact.name}</div>
                  {contact.email && (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted, #888)' }}>{contact.email}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

