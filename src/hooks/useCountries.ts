import { useState, useEffect } from 'react';
import { countryService } from '../services';
import type { Country } from '../types';

export function useCountries(shouldLoad: boolean = true) {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!shouldLoad) {
            return;
        }

        setLoading(true);

        countryService
            .getCountries()
            .then((data) => {
                setCountries(Array.from(data.values()));
                setError(null);
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : 'Failed to load countries');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [shouldLoad]);

    return { countries, loading, error };
}
