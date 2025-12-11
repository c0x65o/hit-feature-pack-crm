'use client';
import { useState, useEffect } from 'react';
export function useCrmDeals(options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const url = options.id
                    ? `/api/crm/deals/${options.id}`
                    : `/api/crm/deals?page=${options.page || 1}&pageSize=${options.pageSize || 25}`;
                const res = await fetch(url);
                if (!res.ok)
                    throw new Error('Failed to fetch deals');
                const json = await res.json();
                setData(options.id ? json : json);
            }
            catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [options.id, options.page, options.pageSize]);
    const createDeal = async (deal) => {
        const res = await fetch('/api/crm/deals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(deal),
        });
        if (!res.ok)
            throw new Error('Failed to create deal');
        return res.json();
    };
    const updateDeal = async (id, deal) => {
        const res = await fetch(`/api/crm/deals/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(deal),
        });
        if (!res.ok)
            throw new Error('Failed to update deal');
        return res.json();
    };
    return { data, loading, error, createDeal, updateDeal };
}
//# sourceMappingURL=useCrmDeals.js.map