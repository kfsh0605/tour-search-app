import { useState, useEffect } from 'react';
import { countryService } from '../services';
import type { Country } from '../types';

export function useCountries() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        countryService
            .getCountries()
            .then((data) => {
                if (isMounted) {
                    setCountries(Array.from(data.values()));
                    setError(null);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Failed to load countries');
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return { countries, loading, error };
}