import { useState } from 'react';
import { SearchForm, TourResults } from './components/features';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useTourSearchStore } from './store';
import styles from './App.module.scss';

function App() {
    const [hasSearched, setHasSearched] = useState(false);
    
    const { startSearch, isSearching } = useTourSearchStore();

    const handleSearch = async (countryID: string) => {
        setHasSearched(true);
        await startSearch(countryID);
    };

    return (
        <div className={styles.app}>
            <a href="#main-content" className="skip-link">
                Skip to main content
            </a>

            <header className={styles.app__header}>
                <div className={styles.app__container}>
                    <h1 className={styles.app__title}>🌴 Tour Search</h1>
                    <p className={styles.app__subtitle}>Find your perfect vacation</p>
                </div>
            </header>

            <main id="main-content" className={styles.app__main}>
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
                                disabled={isSearching}
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
                            <TourResults />
                        </ErrorBoundary>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;
