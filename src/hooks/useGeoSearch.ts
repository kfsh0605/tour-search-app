import { useState, useEffect } from 'react';
import { geoSearchService } from '../services';
import type { GeoEntity } from '../types';

export function useGeoSearch(query: string, delay: number = 300) {
    const [results, setResults] = useState<GeoEntity[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const timeoutId = setTimeout(() => {
            geoSearchService
                .search(query)
                .then((data) => {
                    setResults(data);
                })
                .catch((err) => {
                    console.error('Geo search error:', err);
                    setResults([]);
                })
                .finally(() => {
                    setLoading(false);
                });
        }, delay);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [query, delay]);

    return { results, loading };
}