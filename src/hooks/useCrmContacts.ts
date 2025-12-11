'use client';

import { useState, useEffect } from 'react';

interface UseCrmContactsOptions {
  id?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  companyId?: string;
}

export function useCrmContacts(options: UseCrmContactsOptions = {}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let url: string;
        if (options.id) {
          url = `/api/crm/contacts/${options.id}`;
        } else {
          const params = new URLSearchParams();
          params.set('page', String(options.page || 1));
          params.set('pageSize', String(options.pageSize || 25));
          if (options.search) {
            params.set('search', options.search);
          }
          if (options.companyId) {
            params.set('companyId', options.companyId);
          }
          url = `/api/crm/contacts?${params.toString()}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch contacts');
        const json = await res.json();
        setData(options.id ? json : json);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [options.id, options.page, options.pageSize, options.search, options.companyId]);

  const createContact = async (contact: any) => {
    const res = await fetch('/api/crm/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.error || `Failed to create contact (${res.status})`;
      throw new Error(errorMessage);
    }
    return res.json();
  };

  const updateContact = async (id: string, contact: any) => {
    const res = await fetch(`/api/crm/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.error || `Failed to update contact (${res.status})`;
      throw new Error(errorMessage);
    }
    return res.json();
  };

  return { data, loading, error, createContact, updateContact };
}

