import { useState, useCallback } from 'react';
import { countryService } from '../services';
import type { Country } from '../types';

/**
 * Hook to load countries data with imperative API
 * Returns a method to trigger loading instead of auto-loading on mount
 */
export function useCountries() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadCountries = useCallback(async () => {
        // Don't reload if already loaded
        if (countries.length > 0 || loading) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await countryService.getCountries();
            setCountries(Array.from(data.values()));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load countries');
        } finally {
            setLoading(false);
        }
    }, [countries.length, loading]);

    return { countries, loading, error, loadCountries };
}
