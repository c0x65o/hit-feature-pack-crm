'use client';

import { useState, useEffect } from 'react';

interface UseCrmPersonalNotesOptions {
  contactId?: string;
}

export function useCrmPersonalNotes(options: UseCrmPersonalNotesOptions = {}) {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = options.contactId
          ? `/api/crm/personal-notes?contactId=${options.contactId}`
          : '/api/crm/personal-notes';
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch personal notes');
        const json = await res.json();
        setData(json.items || json);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [options.contactId]);

  const createNote = async (note: any) => {
    const res = await fetch('/api/crm/personal-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    if (!res.ok) throw new Error('Failed to create note');
    return res.json();
  };

  return { data, loading, error, createNote };
}

