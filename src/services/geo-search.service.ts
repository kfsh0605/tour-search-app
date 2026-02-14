import { apiClient } from '../api';
import type { GeoEntity, Country } from '../types';

class GeoSearchService {
    private allEntitiesCache: GeoEntity[] | null = null;
    private initPromise: Promise<void> | null = null;

    async search(query: string): Promise<GeoEntity[]> {
        if (!query) {
            return [];
        }

        // Initialize cache once
        if (!this.allEntitiesCache) {
            await this.initializeCache();
        }

        // After initialization, cache should always be an array (even empty)
        if (!this.allEntitiesCache) {
            return [];
        }

        // Filter by query
        const lowerQuery = query.toLowerCase();
        return this.allEntitiesCache.filter((entity) =>
            entity.name.toLowerCase().includes(lowerQuery)
        );
    }

    private async initializeCache(): Promise<void> {
        // If initialization is already in progress - wait for it
        if (this.initPromise) {
            return this.initPromise;
        }

        // Create promise for initialization
        this.initPromise = this.loadAllEntities();
        
        try {
            await this.initPromise;
        } finally {
            this.initPromise = null;
        }
    }

    private async loadAllEntities(): Promise<void> {
        const allEntities: GeoEntity[] = [];

        try {
            // 1. Get all countries
            const countriesMap = await apiClient.getCountries();
            const countries: GeoEntity[] = Object.values(countriesMap).map((country: Country) => ({
                ...country,
                type: 'country' as const,
            }));
            allEntities.push(...countries);

            // 2. Get hotels for each country
            const hotelPromises = countries.map(async (country) => {
                try {
                    const hotelsMap = await apiClient.getHotels(String(country.id));
                    return Object.values(hotelsMap).map((hotel) => ({
                        ...hotel,
                        type: 'hotel' as const,
                    }));
                } catch (error) {
                    console.error(`Failed to load hotels for ${country.name}:`, error);
                    return [];
                }
            });

            // Wait for all hotels in parallel
            const hotelArrays = await Promise.all(hotelPromises);
            const allHotels = hotelArrays.flat();
            allEntities.push(...allHotels);

            // Save to cache
            this.allEntitiesCache = allEntities;
        } catch (error) {
            console.error('Failed to initialize geo search cache:', error);
            this.allEntitiesCache = [];
        }
    }

    clearCache(): void {
        this.allEntitiesCache = null;
        this.initPromise = null;
    }
}

export const geoSearchService = new GeoSearchService();