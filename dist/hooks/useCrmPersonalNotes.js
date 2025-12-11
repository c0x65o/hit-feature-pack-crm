'use client';
import { useState, useEffect } from 'react';
export function useCrmPersonalNotes(options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const url = options.contactId
                    ? `/api/crm/personal-notes?contactId=${options.contactId}`
                    : '/api/crm/personal-notes';
                const res = await fetch(url);
                if (!res.ok)
                    throw new Error('Failed to fetch personal notes');
                const json = await res.json();
                setData(json.items || json);
            }
            catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [options.contactId]);
    const createNote = async (note) => {
        const res = await fetch('/api/crm/personal-notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note),
        });
        if (!res.ok)
            throw new Error('Failed to create note');
        return res.json();
    };
    return { data, loading, error, createNote };
}
//# sourceMappingURL=useCrmPersonalNotes.js.map