'use client';

import { useState, useEffect } from 'react';

interface MetricsData {
  totals: {
    leads: number;
    opportunities: number;
    contacts: number;
    accounts: number;
    activities: number;
  };
  pipeline: {
    totalValue: number;
    wonValue: number;
  };
  leads: {
    byStatus: Array<{ status: string; count: number }>;
    recentConversions: number;
  };
  opportunities: {
    byStage: Array<{ stage: string; count: number; totalAmount: number }>;
  };
  activities: {
    byType: Array<{ type: string; count: number }>;
    byStatus: Array<{ status: string; count: number }>;
  };
}

export function useCrmMetrics() {
  const [data, setData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/crm/metrics');
        if (!res.ok) throw new Error('Failed to fetch metrics');
        const json = await res.json();
        setData(json);
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

