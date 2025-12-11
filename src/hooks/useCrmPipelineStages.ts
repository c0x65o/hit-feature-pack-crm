'use client';

import { useState, useEffect } from 'react';

export function useCrmPipelineStages() {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/crm/pipeline-stages');
        if (!res.ok) throw new Error('Failed to fetch pipeline stages');
        const json = await res.json();
        setData(json.items || json);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

