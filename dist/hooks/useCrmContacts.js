'use client';
import { useState, useEffect } from 'react';
export function useCrmContacts(options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const url = options.id
                    ? `/api/crm/contacts/${options.id}`
                    : `/api/crm/contacts?page=${options.page || 1}&pageSize=${options.pageSize || 25}`;
                const res = await fetch(url);
                if (!res.ok)
                    throw new Error('Failed to fetch contacts');
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
    const createContact = async (contact) => {
        const res = await fetch('/api/crm/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact),
        });
        if (!res.ok)
            throw new Error('Failed to create contact');
        return res.json();
    };
    const updateContact = async (id, contact) => {
        const res = await fetch(`/api/crm/contacts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact),
        });
        if (!res.ok)
            throw new Error('Failed to update contact');
        return res.json();
    };
    return { data, loading, error, createContact, updateContact };
}
//# sourceMappingURL=useCrmContacts.js.map