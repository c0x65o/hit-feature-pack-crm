'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseCrmActivitiesOptions {
  id?: string;
  contactId?: string;
  dealId?: string;
  page?: number;
  pageSize?: number;
  limit?: number;
  filter?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useCrmActivities(options: UseCrmActivitiesOptions = {}) {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (options.contactId) params.set('contactId', options.contactId);
      if (options.dealId) params.set('dealId', options.dealId);
      if (options.limit) params.set('limit', options.limit.toString());
      if (options.sortBy) params.set('sortBy', options.sortBy);
      if (options.sortOrder) params.set('sortOrder', options.sortOrder);

      const url = options.id
        ? `/api/crm/activities/${options.id}`
        : `/api/crm/activities?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch activities');
      const json = await res.json();
      setData(options.id ? [json] : json.items || json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [options.id, options.contactId, options.dealId, options.limit, options.sortBy, options.sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createActivity = async (activity: any) => {
    const res = await fetch('/api/crm/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    });
    if (!res.ok) throw new Error('Failed to create activity');
    return res.json();
  };

  const updateActivity = async (id: string, activity: any) => {
    const res = await fetch(`/api/crm/activities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    });
    if (!res.ok) throw new Error('Failed to update activity');
    return res.json();
  };

  const deleteActivity = async (id: string) => {
    const res = await fetch(`/api/crm/activities/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.error || `Failed to delete activity (${res.status})`;
      throw new Error(errorMessage);
    }
    return res.json();
  };

  return { data, loading, error, createActivity, updateActivity, deleteActivity, refetch: fetchData };
}

