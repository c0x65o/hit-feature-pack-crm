'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmCompanies } from '../hooks/useCrmCompanies';
import { Building } from 'lucide-react';

interface CompanyAutocompleteProps {
  value: string;
  onChange: (companyId: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function CompanyAutocomplete({
  value,
  onChange,
  label = 'Company',
  placeholder = 'Search for a company...',
  disabled = false,
}: CompanyAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<{ id: string; name: string } | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch company details when value changes
  useEffect(() => {
    if (value && !selectedCompany) {
      const fetchCompany = async () => {
        try {
          const res = await fetch(`/api/crm/companies/${value}`);
          if (res.ok) {
            const company = await res.json();
            setSelectedCompany({ id: company.id, name: company.name || 'Unknown Company' });
            setSearchQuery(company.name || '');
          }
        } catch (error) {
          console.error('Error fetching company:', error);
        }
      };
      fetchCompany();
    } else if (!value) {
      setSelectedCompany(null);
      setSearchQuery('');
    }
  }, [value, selectedCompany]);

  const { data: companiesData, loading } = useCrmCompanies({
    search: searchQuery,
    pageSize: 10,
  });

  const companies = companiesData?.items || [];

  // Debounce search
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (searchQuery.length < 2 && !selectedCompany) {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      return;
    }

    if (selectedCompany && searchQuery === selectedCompany.name) {
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
  }, [searchQuery, selectedCompany]);

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

  const handleSelectCompany = (company: { id: string; name: string }) => {
    setSelectedCompany(company);
    setSearchQuery(company.name);
    onChange(company.id);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    if (!newValue) {
      setSelectedCompany(null);
      onChange('');
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedCompany(null);
    onChange('');
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || companies.length === 0) {
      if (e.key === 'Enter' && selectedCompany) {
        // Allow form submission if company is selected
        return;
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < companies.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < companies.length) {
          handleSelectCompany({ 
            id: companies[highlightedIndex].id, 
            name: companies[highlightedIndex].name 
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
      const item = suggestionsRef.current.children[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedIndex]);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        {selectedCompany && (
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
        <div>
          {label && (
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: 500, 
              color: 'var(--hit-foreground)',
              marginBottom: '8px',
            }}>
              {label}
            </label>
          )}
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
            aria-controls="company-autocomplete-list"
            aria-activedescendant={highlightedIndex >= 0 ? `company-option-${highlightedIndex}` : undefined}
            style={{
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
            }}
          />
        </div>
      </div>

      {showSuggestions && !selectedCompany && (
        <div
          ref={suggestionsRef}
          id="company-autocomplete-list"
          role="listbox"
          aria-label="Company suggestions"
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
            <div 
              role="status"
              aria-live="polite"
              style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-muted, #888)' }}
            >
              Searching...
            </div>
          ) : companies.length === 0 ? (
            <div 
              role="status"
              style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-muted, #888)' }}
            >
              No companies found
            </div>
          ) : (
            companies.map((company: { id: string; name: string; city?: string; state?: string }, index: number) => (
              <div
                key={company.id}
                id={`company-option-${index}`}
                role="option"
                aria-selected={highlightedIndex === index}
                onClick={() => handleSelectCompany({ id: company.id, name: company.name })}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderBottom: index < companies.length - 1 ? '1px solid var(--border-default, #333)' : 'none',
                  backgroundColor: highlightedIndex === index ? 'var(--bg-hover, #2a2a2a)' : 'transparent',
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseLeave={() => setHighlightedIndex(-1)}
              >
                <Building size={16} style={{ color: 'var(--text-muted, #888)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, marginBottom: '2px' }}>{company.name}</div>
                  {(company.city || company.state) && (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted, #888)' }}>
                      {[company.city, company.state].filter(Boolean).join(', ')}
                    </div>
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
