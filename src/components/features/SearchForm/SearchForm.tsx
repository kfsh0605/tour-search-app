import { useState } from 'react';
import { Button, Combobox } from '../../ui';
import { useCountries, useGeoSearch, useGeoEntityOptions } from '../../../hooks';
import type { GeoEntity } from '../../../types';
import styles from './SearchForm.module.scss';

export interface SearchFormProps {
    onSearch: (countryID: string) => void;
    disabled?: boolean;
}

export function SearchForm({ onSearch, disabled = false }: SearchFormProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEntity, setSelectedEntity] = useState<GeoEntity | null>(null);
    const [shouldLoadCountries, setShouldLoadCountries] = useState(false);

    const { countries, loading: countriesLoading } = useCountries(shouldLoadCountries);
    const { results: searchResults, loading: searchLoading } = useGeoSearch(searchQuery);

    // Determine what to show in dropdown
    const dropdownItems: GeoEntity[] = searchQuery
        ? searchResults
        : countries.map((c) => ({ ...c, type: 'country' as const }));

    // Convert GeoEntity[] to ComboboxOption[] using hook
    const comboboxOptions = useGeoEntityOptions(dropdownItems);

    const handleSearchQueryChange = (value: string) => {
        setSearchQuery(value);
        // Reset selection only if text doesn't match selected entity
        if (selectedEntity && value !== selectedEntity.name) {
            setSelectedEntity(null);
        }
        
        // Lazy load countries on first interaction
        if (!shouldLoadCountries) {
            setShouldLoadCountries(true);
        }
    };

    const handleSelectOption = (option: any) => {
        const entity = option.value as GeoEntity;
        setSelectedEntity(entity);
        setSearchQuery(entity.name);
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
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form} role="search">
            <div className={styles.form__field}>
                <Combobox
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                    onSelect={handleSelectOption}
                    options={comboboxOptions}
                    placeholder="Search destination..."
                    loading={countriesLoading || searchLoading}
                    disabled={disabled}
                    aria-label="Search for destination"
                />
            </div>

            <Button type="submit" variant="primary" disabled={disabled || !selectedEntity}>
                Search
            </Button>
        </form>
    );
}
