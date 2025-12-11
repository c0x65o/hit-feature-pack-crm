'use client';
import { useState, useEffect } from 'react';
export function useCrmCompanies(options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const url = options.id
                    ? `/api/crm/companies/${options.id}`
                    : `/api/crm/companies?page=${options.page || 1}&pageSize=${options.pageSize || 25}`;
                const res = await fetch(url);
                if (!res.ok)
                    throw new Error('Failed to fetch companies');
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
    const createCompany = async (company) => {
        const res = await fetch('/api/crm/companies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(company),
        });
        if (!res.ok)
            throw new Error('Failed to create company');
        return res.json();
    };
    const updateCompany = async (id, company) => {
        const res = await fetch(`/api/crm/companies/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(company),
        });
        if (!res.ok)
            throw new Error('Failed to update company');
        return res.json();
    };
    return { data, loading, error, createCompany, updateCompany };
}
//# sourceMappingURL=useCrmCompanies.js.map