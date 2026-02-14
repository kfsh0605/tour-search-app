import {apiClient} from '../api';
import type {GeoEntity} from '../types';

class GeoSearchService {
    private searchCache = new Map<string, GeoEntity[]>();

    async search(query: string): Promise<GeoEntity[]> {
        if (!query) {
            return [];
        }

        if (this.searchCache.has(query)) {
            return this.searchCache.get(query)!;
        }

        const data = await apiClient.searchGeo(query);
        const results = Object.values(data);

        this.searchCache.set(query, results);
        return results;
    }

    clearCache(): void {
        this.searchCache.clear();
    }
}

export const geoSearchService = new GeoSearchService();