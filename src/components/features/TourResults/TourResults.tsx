import { useMemo } from 'react';
import { TourCard } from '../TourCard';
import { Loader } from '../../ui';
import { useHotels } from '../../../hooks';
import type { PriceOffer } from '../../../types';
import styles from './TourResults.module.scss';

export interface TourResultsProps {
    prices: Map<string, PriceOffer> | null;
    countryID: string | null;
    loading: boolean;
    error: string | null;
}

export function TourResults({
                                prices,
                                countryID,
                                loading,
                                error,
                            }: TourResultsProps) {
    const { hotels, loading: hotelsLoading } = useHotels(countryID);

    // Combine prices with hotels and sort by price
    const tours = useMemo(() => {
        if (!prices || !hotels.size) {
            return [];
        }

        const toursArray = Array.from(prices.values())
            .map((price) => {
                const hotelId = Number(price.hotelID) || 0;
                const hotel = hotels.get(hotelId);
                if (!hotel) return null;
                return { price, hotel };
            })
            .filter((tour) => tour !== null)
            .sort((a, b) => a!.price.amount - b!.price.amount);

        return toursArray as Array<{ price: PriceOffer; hotel: any }>;
    }, [prices, hotels]);

    const handleOpenPrice = (priceId: string) => {
        console.log('Opening price:', priceId);
        alert(`Price details for: ${priceId}`);
    };

    // Loading state
    if (loading || hotelsLoading) {
        return (
            <div className={styles.results}>
                <Loader centered />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={styles.results}>
                <div className={styles.results__error}>
                    <div className={styles.results__errorIcon}>⚠️</div>
                    <h3 className={styles.results__errorTitle}>Something went wrong</h3>
                    <p className={styles.results__errorMessage}>{error}</p>
                </div>
            </div>
        );
    }

    // Empty state
    if (!prices || tours.length === 0) {
        return (
            <div className={styles.results}>
                <div className={styles.results__empty}>
                    <div className={styles.results__emptyIcon}>🔍</div>
                    <h3 className={styles.results__emptyTitle}>No tours found</h3>
                    <p className={styles.results__emptyMessage}>
                        Try searching for a different destination
                    </p>
                </div>
            </div>
        );
    }

    // Success state with results
    return (
        <div className={styles.results}>
            <div className={styles.results__header}>
                <h2 className={styles.results__title}>
                    Found {tours.length} tour{tours.length !== 1 ? 's' : ''}
                </h2>
            </div>

            <div className={styles.results__grid}>
                {tours.map(({ price, hotel }) => (
                    <TourCard
                        key={price.id}
                        hotel={hotel}
                        price={price}
                        onOpenPrice={handleOpenPrice}
                    />
                ))}
            </div>
        </div>
    );
}