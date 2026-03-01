import { useState, useEffect } from 'react';
import { tourAggregationService } from '../services';
import { useTourSearchStore } from '../store';
import type { Tour } from '../types';

/**
 * Hook to get aggregated tours (prices + hotels)
 * Uses TourAggregationService to combine data
 * 
 * This hook replaces the logic that was previously in TourResults component
 */
export function useTours(countryID: string | null) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { prices, status } = useTourSearchStore();

  useEffect(() => {
    if (!countryID || !prices || status !== 'success') {
      setTours([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    tourAggregationService
      .aggregateToursForPrices(prices, countryID)
      .then((aggregatedTours) => {
        if (isMounted) {
          setTours(aggregatedTours);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load tours');
          setTours([]);
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
  }, [prices, countryID, status]);

  return { tours, loading, error };
}
