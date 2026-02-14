import {apiClient} from '../api';
import type {GeoEntity} from '../types';

class GeoSearchService {
    private allEntitiesCache: GeoEntity[] | null = null;

    async search(query: string): Promise<GeoEntity[]> {
        if (!query) {
            return [];
        }

        // Load all entities once
        if (!this.allEntitiesCache) {
            // Call searchGeo multiple times with different lengths to get all data
            const results: GeoEntity[] = [];
            const seenIds = new Set<string>();

            for (let i = 0; i < 10; i++) {
                try {
                    const data = await apiClient.searchGeo('x'.repeat(i));
                    Object.values(data).forEach((entity) => {
                        const key = `${entity.type}-${entity.id}`;
                        if (!seenIds.has(key)) {
                            seenIds.add(key);
                            results.push(entity);
                        }
                    });
                } catch (error) {
                    // Ignore errors
                }
            }

            this.allEntitiesCache = results;
        }

        // Filter by query
        const lowerQuery = query.toLowerCase();
        return this.allEntitiesCache.filter((entity) =>
            entity.name.toLowerCase().includes(lowerQuery)
        );
    }

    clearCache(): void {
        this.allEntitiesCache = null;
    }
}

export const geoSearchService = new GeoSearchService();