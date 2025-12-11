'use client';

import { useState, useEffect } from 'react';

interface UseCrmDealsOptions {
  id?: string;
  page?: number;
  pageSize?: number;
  filter?: string;
  search?: string;
}

export function useCrmDeals(options: UseCrmDealsOptions = {}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let url: string;
        if (options.id) {
          url = `/api/crm/deals/${options.id}`;
        } else {
          const params = new URLSearchParams();
          params.set('page', String(options.page || 1));
          params.set('pageSize', String(options.pageSize || 25));
          if (options.search) {
            params.set('search', options.search);
          }
          url = `/api/crm/deals?${params.toString()}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch deals');
        const json = await res.json();
        setData(options.id ? json : json);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [options.id, options.page, options.pageSize, options.search]);

  const createDeal = async (deal: any) => {
    const res = await fetch('/api/crm/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deal),
    });
    if (!res.ok) throw new Error('Failed to create deal');
    return res.json();
  };

  const updateDeal = async (id: string, deal: any) => {
    const res = await fetch(`/api/crm/deals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deal),
    });
    if (!res.ok) throw new Error('Failed to update deal');
    return res.json();
  };

  return { data, loading, error, createDeal, updateDeal };
}

