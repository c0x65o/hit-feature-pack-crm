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
                let url;
                if (options.id) {
                    url = `/api/crm/contacts/${options.id}`;
                }
                else {
                    const params = new URLSearchParams();
                    params.set('page', String(options.page || 1));
                    params.set('pageSize', String(options.pageSize || 25));
                    if (options.search) {
                        params.set('search', options.search);
                    }
                    if (options.companyId) {
                        params.set('companyId', options.companyId);
                    }
                    url = `/api/crm/contacts?${params.toString()}`;
                }
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
    }, [options.id, options.page, options.pageSize, options.search, options.companyId]);
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