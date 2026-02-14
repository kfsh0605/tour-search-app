import { useState } from 'react';
import { SearchForm, TourResults } from './components/features';
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
                    <div className={styles.app__search}>
                        <SearchForm
                            onSearch={handleSearch}
                            disabled={tourSearch.isSearching}
                        />
                    </div>

                    {hasSearched && (
                        <TourResults
                            prices={tourSearch.prices}
                            countryID={selectedCountry}
                            loading={tourSearch.isSearching}
                            error={tourSearch.error}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;