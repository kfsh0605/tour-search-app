import { useState, useEffect } from 'react';
import { hotelService } from '../services';
import type { Hotel } from '../types';

export function useHotels(countryID: string | null) {
    const [hotels, setHotels] = useState<Map<number, Hotel>>(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!countryID) {
            setHotels(new Map());
            setLoading(false);
            return;
        }

        setLoading(true);

        hotelService
            .getHotelsByCountry(countryID)
            .then((data) => {
                setHotels(data);
                setError(null);
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : 'Failed to load hotels');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [countryID]);

    return { hotels, loading, error };
}
