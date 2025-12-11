'use client';
import { useState, useEffect } from 'react';
export function useCrmActivities(options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (options.contactId)
                    params.set('contactId', options.contactId);
                if (options.dealId)
                    params.set('dealId', options.dealId);
                if (options.limit)
                    params.set('limit', options.limit.toString());
                if (options.sortBy)
                    params.set('sortBy', options.sortBy);
                if (options.sortOrder)
                    params.set('sortOrder', options.sortOrder);
                const url = options.id
                    ? `/api/crm/activities/${options.id}`
                    : `/api/crm/activities?${params.toString()}`;
                const res = await fetch(url);
                if (!res.ok)
                    throw new Error('Failed to fetch activities');
                const json = await res.json();
                setData(options.id ? [json] : json.items || json);
            }
            catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [options.id, options.contactId, options.dealId, options.limit, options.sortBy, options.sortOrder]);
    const createActivity = async (activity) => {
        const res = await fetch('/api/crm/activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(activity),
        });
        if (!res.ok)
            throw new Error('Failed to create activity');
        return res.json();
    };
    const updateActivity = async (id, activity) => {
        const res = await fetch(`/api/crm/activities/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(activity),
        });
        if (!res.ok)
            throw new Error('Failed to update activity');
        return res.json();
    };
    return { data, loading, error, createActivity, updateActivity };
}
//# sourceMappingURL=useCrmActivities.js.map