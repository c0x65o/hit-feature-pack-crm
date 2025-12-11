'use client';
import { useState, useEffect } from 'react';
export function useGlobalSearch(query) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!query || query.length < 2) {
            setData(null);
            return;
        }
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/crm/search?q=${encodeURIComponent(query)}`);
                if (!res.ok)
                    throw new Error('Search failed');
                const json = await res.json();
                setData(json.results || []);
            }
            catch (err) {
                setData([]);
            }
            finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(fetchData, 300);
        return () => clearTimeout(timer);
    }, [query]);
    return { data, loading };
}
//# sourceMappingURL=useGlobalSearch.js.map