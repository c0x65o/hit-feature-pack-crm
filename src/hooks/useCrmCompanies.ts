'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseCrmCompaniesOptions {
  id?: string;
  page?: number;
  pageSize?: number;
  search?: string;
}

export function useCrmCompanies(options: UseCrmCompaniesOptions = {}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      let url = options.id
        ? `/api/crm/companies/${options.id}`
        : `/api/crm/companies?page=${options.page || 1}&pageSize=${options.pageSize || 25}`;
      
      if (options.search && !options.id) {
        url += `&search=${encodeURIComponent(options.search)}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch companies');
      const json = await res.json();
      setData(options.id ? json : json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [options.id, options.page, options.pageSize, options.search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createCompany = async (company: any) => {
    const res = await fetch('/api/crm/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(company),
    });
    if (!res.ok) throw new Error('Failed to create company');
    return res.json();
  };

  const updateCompany = async (id: string, company: any) => {
    const res = await fetch(`/api/crm/companies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(company),
    });
    if (!res.ok) throw new Error('Failed to update company');
    return res.json();
  };

  const deleteCompany = async (id: string) => {
    const res = await fetch(`/api/crm/companies/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.error || `Failed to delete company (${res.status})`;
      throw new Error(errorMessage);
    }
    return res.json();
  };

  return { data, loading, error, createCompany, updateCompany, deleteCompany, refetch: fetchData };
}

