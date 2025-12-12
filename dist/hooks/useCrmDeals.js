'use client';
import { useState, useEffect, useCallback } from 'react';
export function useCrmDeals(options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            let url;
            if (options.id) {
                url = `/api/crm/deals/${options.id}`;
            }
            else {
                const params = new URLSearchParams();
                params.set('page', String(options.page || 1));
                params.set('pageSize', String(options.pageSize || 25));
                if (options.search) {
                    params.set('search', options.search);
                }
                url = `/api/crm/deals?${params.toString()}`;
            }
            const res = await fetch(url);
            if (!res.ok)
                throw new Error('Failed to fetch deals');
            const json = await res.json();
            setData(options.id ? json : json);
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
        }
        finally {
            setLoading(false);
        }
    }, [options.id, options.page, options.pageSize, options.search]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
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
    const deleteDeal = async (id) => {
        const res = await fetch(`/api/crm/deals/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const errorMessage = errorData.error || `Failed to delete deal (${res.status})`;
            throw new Error(errorMessage);
        }
        return res.json();
    };
    return { data, loading, error, createDeal, updateDeal, deleteDeal, refetch: fetchData };
}
//# sourceMappingURL=useCrmDeals.js.map