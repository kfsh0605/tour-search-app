import {apiClient} from '../api';
import type {GeoEntity} from '../types';

class GeoSearchService {
    private allEntitiesCache: GeoEntity[] | null = null;
    private isLoading = false;

    async search(query: string): Promise<GeoEntity[]> {
        if (!query) {
            return [];
        }

        // Load all entities once
        if (!this.allEntitiesCache && !this.isLoading) {
            this.isLoading = true;
            
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
            this.isLoading = false;
        }

        // Wait if loading
        while (this.isLoading) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Filter by query
        const lowerQuery = query.toLowerCase();
        return this.allEntitiesCache?.filter((entity) =>
            entity.name.toLowerCase().includes(lowerQuery)
        ) || [];
    }

    clearCache(): void {
        this.allEntitiesCache = null;
        this.isLoading = false;
    }
}

export const geoSearchService = new GeoSearchService();