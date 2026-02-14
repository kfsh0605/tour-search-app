import { useState, useRef, useEffect } from 'react';
import { Input, Button } from '../../ui';
import { useCountries, useGeoSearch } from '../../../hooks';
import { getCountryFlagUrl } from '../../../utils';
import type { GeoEntity } from '../../../types';
import styles from './SearchForm.module.scss';

export interface SearchFormProps {
    onSearch: (countryID: string) => void;
    disabled?: boolean;
}

export function SearchForm({ onSearch, disabled = false }: SearchFormProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEntity, setSelectedEntity] = useState<GeoEntity | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [shouldLoadCountries, setShouldLoadCountries] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { countries, loading: countriesLoading } = useCountries(shouldLoadCountries);
    const { results: searchResults, loading: searchLoading } = useGeoSearch(searchQuery);

    // Determine what to show in dropdown
    const dropdownItems: GeoEntity[] = searchQuery
        ? searchResults
        : countries.map((c) => ({ ...c, type: 'country' as const }));

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleInputClick = () => {
        setShouldLoadCountries(true);
        setIsDropdownOpen(true);
    };

    const handleSelectEntity = (entity: GeoEntity) => {
        setSelectedEntity(entity);
        setSearchQuery(entity.name);
        setIsDropdownOpen(false);
    };

    const handleInputChange = (value: string) => {
        setSearchQuery(value);
        setSelectedEntity(null);
        setIsDropdownOpen(true);
    };

    const handleClear = () => {
        setSearchQuery('');
        setSelectedEntity(null);
        setIsDropdownOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedEntity) {
            return;
        }

        // Get country ID
        let countryID: string;
        if (selectedEntity.type === 'country') {
            countryID = selectedEntity.id;
        } else if (selectedEntity.type === 'city' || selectedEntity.type === 'hotel') {
            countryID = selectedEntity.countryId;
        } else {
            return;
        }

        onSearch(countryID);
        setIsDropdownOpen(false);
    };

    const getEntityIcon = (entity: GeoEntity) => {
        switch (entity.type) {
            case 'country':
                return (
                    <img 
                        src={getCountryFlagUrl(entity.id, 20)} 
                        alt={entity.name}
                        className={styles.form__flagIcon}
                    />
                );
            case 'city':
            case 'hotel':
                return (
                    <img 
                        src={getCountryFlagUrl(entity.countryId, 20)} 
                        alt=""
                        className={styles.form__flagIcon}
                    />
                );
            default:
                return '📍';
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form} role="search">
            <div className={styles.form__field} ref={dropdownRef}>
                <Input
                    ref={inputRef}
                    placeholder="Search destination..."
                    value={searchQuery}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onClick={handleInputClick}
                    onClear={handleClear}
                    prefixIcon="🔍"
                    disabled={disabled}
                    aria-label="Search for destination"
                    aria-autocomplete="list"
                    aria-controls={isDropdownOpen ? 'destination-listbox' : undefined}
                    aria-expanded={isDropdownOpen}
                    role="combobox"
                />

                {isDropdownOpen && (
                    <div 
                        id="destination-listbox"
                        className={styles.form__dropdown}
                        role="listbox"
                        aria-label="Destination suggestions"
                    >
                        {countriesLoading || searchLoading ? (
                            <div className={styles.form__loading} role="status" aria-live="polite">
                                Loading...
                            </div>
                        ) : dropdownItems.length > 0 ? (
                            dropdownItems.map((entity) => (
                                <button
                                    key={`${entity.type}-${entity.id}`}
                                    type="button"
                                    className={styles.form__item}
                                    onClick={() => handleSelectEntity(entity)}
                                    role="option"
                                    aria-selected={selectedEntity?.id === entity.id}
                                >
                                    <span className={styles.form__icon} aria-hidden="true">
                                        {getEntityIcon(entity)}
                                    </span>
                                    <span className={styles.form__name}>
                                        {entity.name}
                                        {entity.type !== 'country' && (
                                            <span className={styles.form__subtitle}>
                                                {' '}- {entity.type === 'city' ? 'City' : 'Hotel'}
                                            </span>
                                        )}
                                    </span>
                                </button>
                            ))
                        ) : (
                            <div className={styles.form__empty} role="status">
                                No results found
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Button type="submit" variant="primary" disabled={disabled || !selectedEntity}>
                Search
            </Button>
        </form>
    );
}