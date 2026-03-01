import { useState, useEffect } from 'react';
import { tourAggregationService } from '../services';
import { useTourSearchStore } from '../store';
import type { Tour } from '../types';

/**
 * Hook to get aggregated tours (prices + hotels)
 * Uses TourAggregationService to combine data
 * 
 * This hook replaces the logic that was previously in TourResults component
 * Now loads ONLY the specific hotels needed (not all hotels in country)
 */
export function useTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { prices, status } = useTourSearchStore();

  useEffect(() => {
    if (!prices || status !== 'success') {
      setTours([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    tourAggregationService
      .aggregateToursForPrices(prices)
      .then((aggregatedTours) => {
        setTours(aggregatedTours);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load tours');
        setTours([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [prices, status]);

  return { tours, loading, error };
}
