'use client';
import { useState, useEffect } from 'react';
export function useCrmMetrics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/crm/metrics');
                if (!res.ok)
                    throw new Error('Failed to fetch metrics');
                const json = await res.json();
                setData(json);
            }
            catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    return { data, loading, error };
}
//# sourceMappingURL=useCrmMetrics.js.map