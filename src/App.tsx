import { useState } from 'react';
import { SearchForm, TourResults } from './components/features';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useTourSearch } from './hooks';
import styles from './App.module.scss';

function App() {
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const tourSearch = useTourSearch();

    const handleSearch = async (countryID: string) => {
        setSelectedCountry(countryID);
        setHasSearched(true);
        await tourSearch.startSearch(countryID);
    };

    return (
        <div className={styles.app}>
            <header className={styles.app__header}>
                <div className={styles.app__container}>
                    <h1 className={styles.app__title}>🌴 Tour Search</h1>
                    <p className={styles.app__subtitle}>Find your perfect vacation</p>
                </div>
            </header>

            <main className={styles.app__main}>
                <div className={styles.app__container}>
                    <ErrorBoundary
                        fallback={
                            <div className={styles.app__error}>
                                <p>Unable to load search form. Please refresh the page.</p>
                            </div>
                        }
                    >
                        <div className={styles.app__search}>
                            <SearchForm
                                onSearch={handleSearch}
                                disabled={tourSearch.isSearching}
                            />
                        </div>
                    </ErrorBoundary>

                    {hasSearched && (
                        <ErrorBoundary
                            fallback={
                                <div className={styles.app__error}>
                                    <p>Unable to load results. Please try searching again.</p>
                                </div>
                            }
                        >
                            <TourResults
                                prices={tourSearch.prices}
                                countryID={selectedCountry}
                                loading={tourSearch.isSearching}
                                error={tourSearch.error}
                            />
                        </ErrorBoundary>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;