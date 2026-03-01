import { TourCard } from '../TourCard';
import { Loader } from '../../ui';
import { useTours } from '../../../hooks';
import { useTourSearchStore } from '../../../store';
import styles from './TourResults.module.scss';

export interface TourResultsProps {
    countryID: string | null;
}

export function TourResults({ countryID }: TourResultsProps) {
    const { status, error: searchError } = useTourSearchStore();
    const { tours, loading: toursLoading, error: toursError } = useTours(countryID);

    const handleOpenPrice = (_priceId: string) => {
        // TODO: Implement price details modal or navigation
    };

    // Loading state
    if (status === 'searching' || status === 'polling' || toursLoading) {
        return (
            <div className={styles.results}>
                <Loader size="large" centered />
            </div>
        );
    }

    // Error state
    if (searchError || toursError) {
        return (
            <div className={styles.results}>
                <div className={styles.results__error}>
                    <h2 className={styles.results__errorTitle}>Search Failed</h2>
                    <p className={styles.results__errorMessage}>
                        {searchError || toursError}
                    </p>
                </div>
            </div>
        );
    }

    // Empty state
    if (status === 'success' && tours.length === 0) {
        return (
            <div className={styles.results}>
                <div className={styles.results__empty}>
                    <p className={styles.results__emptyIcon}>🏝️</p>
                    <h2 className={styles.results__emptyTitle}>No tours found</h2>
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
            <div className={styles.results__header} role="status" aria-live="polite">
                <h2 className={styles.results__title}>
                    Found {tours.length} tour{tours.length !== 1 ? 's' : ''}
                </h2>
            </div>

            <div className={styles.results__grid} role="list" aria-label="Tour results">
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
