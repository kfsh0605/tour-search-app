import { apiClient } from '../api';
import type { Country } from '../types';

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