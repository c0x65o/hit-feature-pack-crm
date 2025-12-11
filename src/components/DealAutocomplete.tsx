'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmDeals } from '../hooks/useCrmDeals';
import { TrendingUp } from 'lucide-react';

interface DealAutocompleteProps {
  value: string;
  onChange: (dealId: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function DealAutocomplete({
  value,
  onChange,
  label = 'Related Deal',
  placeholder = 'Search for a deal...',
  disabled = false,
}: DealAutocompleteProps) {
  const { Input } = useUi();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<{ id: string; name: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        } catch (error) {
          console.error('Error fetching deal:', error);
        }
      };
      fetchDeal();
    } else if (!value) {
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
      return;
    }

    if (selectedDeal && searchQuery === selectedDeal.name) {
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
  }, [searchQuery, selectedDeal]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectDeal = (deal: { id: string; name: string }) => {
    setSelectedDeal(deal);
    setSearchQuery(deal.name);
    onChange(deal.id);
    setShowSuggestions(false);
  };

  const handleInputChange = (newValue: string) => {
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
  };

  const formatCurrency = (amount: string | number | null | undefined) => {
    if (!amount) return '';
    const num = parseFloat(amount.toString());
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        {selectedDeal && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
            style={{ marginTop: '12px' }}
          >
            ×
          </button>
        )}
        <Input
          label={label}
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>

      {showSuggestions && !selectedDeal && (
        <div
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
            <div style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-muted, #888)' }}>
              Searching...
            </div>
          ) : deals.length === 0 ? (
            <div style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-muted, #888)' }}>
              No deals found
            </div>
          ) : (
            deals.map((deal: { id: string; dealName: string; amount?: string | number | null }) => (
              <div
                key={deal.id}
                onClick={() => handleSelectDeal({ id: deal.id, name: deal.dealName })}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderBottom: deals.indexOf(deal) < deals.length - 1 ? '1px solid var(--border-default, #333)' : 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-hover, #2a2a2a)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <TrendingUp size={16} style={{ color: 'var(--text-muted, #888)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, marginBottom: '2px' }}>{deal.dealName}</div>
                  {deal.amount && (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted, #888)' }}>
                      {formatCurrency(deal.amount)}
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

