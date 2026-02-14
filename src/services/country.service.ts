import { apiClient } from '../api';
import type { Country } from '../types';

/**
 * Service for managing country data
 * 
 * Note: This is a singleton service instance. For production apps with multiple
 * tabs or complex state management needs, consider using React Context or a
 * state management library (Redux, Zustand, etc.)
 * 
 * Current approach is sufficient for this application's scope.
 */
class CountryService {
    private cache: Map<string, Country> | null = null;

    async getCountries(): Promise<Map<string, Country>> {
        if (this.cache) {
            return this.cache;
        }

        const data = await apiClient.getCountries();
        this.cache = new Map(
            Object.entries(data).map(([id, country]) => [id, country])
        );

        return this.cache;
    }

    async getCountryById(id: string): Promise<Country | undefined> {
        const countries = await this.getCountries();
        return countries.get(id);
    }

    clearCache(): void {
        this.cache = null;
    }
}

export const countryService = new CountryService();