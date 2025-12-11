'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Search, User, Building, TrendingUp } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useGlobalSearch } from '../hooks/useGlobalSearch';

interface GlobalSearchProps {
  onSelect?: (type: 'contact' | 'company' | 'deal', id: string) => void;
}

export function GlobalSearch({ onSelect }: GlobalSearchProps) {
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

  const handleSelect = useCallback(
    (type: 'contact' | 'company' | 'deal', id: string) => {
      if (onSelect) {
        onSelect(type, id);
      } else if (typeof window !== 'undefined') {
        const path = `/crm/${type === 'contact' ? 'contacts' : type === 'company' ? 'companies' : 'deals'}/${id}`;
        window.location.href = path;
      }
    },
    [onSelect]
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return <User size={16} />;
      case 'company':
        return <Building size={16} />;
      case 'deal':
        return <TrendingUp size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <div className="pl-10 w-full">
          <Input
            type="search"
            placeholder="Search contacts, companies, deals..."
            value={query}
            onChange={setQuery}
          />
        </div>
      </div>

      {query && (
        <div className="absolute top-full mt-2 w-full z-50 shadow-lg">
          <Card>
            {loading ? (
              <div className="p-4 flex justify-center">
                <Spinner />
              </div>
            ) : results && results.length > 0 ? (
              <div>
                {/* Group results by type */}
                {['contact', 'company', 'deal'].map((type) => {
                  const typeResults = results.filter((r: { type: string }) => r.type === type);
                  if (typeResults.length === 0) return null;

                  return (
                    <div key={type} className="mb-4 last:mb-0">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                        {type === 'contact' ? 'Contacts' : type === 'company' ? 'Companies' : 'Deals'}
                      </div>
                      <ul>
                        {typeResults.map((result: { id: string; name: string; subtitle?: string; badge?: string }) => (
                          <li
                            key={result.id}
                            className="cursor-pointer hover:bg-gray-50 px-4 py-2"
                            onClick={() => handleSelect(type as 'contact' | 'company' | 'deal', result.id)}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              {getIcon(type)}
                              <div className="flex-1">
                                <div className="font-medium">{result.name}</div>
                                {result.subtitle && (
                                  <div className="text-sm text-gray-500">{result.subtitle}</div>
                                )}
                              </div>
                              {result.badge && (
                                <Badge variant="default">{result.badge}</Badge>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No results found
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

