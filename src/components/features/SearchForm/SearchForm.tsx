import { useState, useRef } from 'react';
import { Input, Button, Dropdown, DropdownItem } from '../../ui';
import { useCountries, useGeoSearch } from '../../../hooks';
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
    const inputRef = useRef<HTMLInputElement>(null);

    const { countries, loading: countriesLoading } = useCountries();
    const { results: searchResults, loading: searchLoading } = useGeoSearch(searchQuery);

    // Determine what to show in dropdown
    const showCountries = !searchQuery && isDropdownOpen;
    const showSearchResults = searchQuery && isDropdownOpen;

    const dropdownItems: GeoEntity[] = showCountries
        ? countries.map((c) => ({ ...c, type: 'country' as const }))
        : showSearchResults
            ? searchResults
            : [];

    const handleInputClick = () => {
        setIsDropdownOpen(true);
    };

    const handleSelectEntity = (entity: GeoEntity) => {
        setSelectedEntity(entity);
        setSearchQuery(entity.name);
        setIsDropdownOpen(false);
    };

    const handleInputChange = (value: string) => {
        setSearchQuery(value);
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

    const getEntityIcon = (type: string) => {
        switch (type) {
            case 'country':
                return '🌍';
            case 'city':
                return '🏙️';
            case 'hotel':
                return '🏨';
            default:
                return '📍';
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.form__field}>
                <Dropdown
                    isOpen={isDropdownOpen}
                    onClose={() => setIsDropdownOpen(false)}
                    trigger={
                        <div>
                            <Input
                                ref={inputRef}
                                placeholder="Search destination..."
                                value={searchQuery}
                                onChange={(e) => handleInputChange(e.target.value)}
                                onClick={handleInputClick}
                                onClear={handleClear}
                                prefixIcon="🔍"
                                disabled={disabled}
                            />
                        </div>
                    }
                >
                    {countriesLoading || searchLoading ? (
                        <div className={styles.form__loading}>Loading...</div>
                    ) : dropdownItems.length > 0 ? (
                        dropdownItems.map((entity) => (
                            <DropdownItem
                                key={`${entity.type}-${entity.id}`}
                                onClick={() => handleSelectEntity(entity)}
                                icon={getEntityIcon(entity.type)}
                            >
                                {entity.name}
                                {entity.type !== 'country' && (
                                    <span className={styles.form__subtitle}>
                    {' '}
                                        - {entity.type === 'city' ? 'City' : 'Hotel'}
                  </span>
                                )}
                            </DropdownItem>
                        ))
                    ) : (
                        <div className={styles.form__empty}>No results found</div>
                    )}
                </Dropdown>
            </div>

            <Button type="submit" variant="primary" disabled={disabled || !selectedEntity}>
                Search
            </Button>
        </form>
    );
}