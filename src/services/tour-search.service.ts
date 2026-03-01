import { apiClient, isNotReadyError } from '../api';
import type { SearchState } from '../types';

type StateChangeCallback = (state: SearchState) => void;

/**
 * Service for managing tour search operations
 * 
 * Note: This is a singleton service instance that maintains search state.
 * For production apps with multiple tabs or complex state requirements,
 * consider using React Context or a state management library (Redux, Zustand, etc.)
 * 
 * Current approach is sufficient for this application's scope where only one
 * search can be active at a time.
 */
class TourSearchService {
    private currentSearch: SearchState = {
        status: 'idle',
        token: null,
        prices: null,
        error: null,
        retryCount: 0,
    };

    private pollingTimeout: ReturnType<typeof setTimeout> | null = null;
    private maxRetries = 2;

    async startSearch(
        countryID: string,
        onStateChange: StateChangeCallback
    ): Promise<void> {
        // Reset state
        this.currentSearch = {
            status: 'searching',
            token: null,
            prices: null,
            error: null,
            retryCount: 0,
        };
        onStateChange(this.currentSearch);

        try {
            // Start search and get token
            const { token, waitUntil } = await apiClient.startSearchPrices(countryID);

            this.currentSearch.token = token;
            this.currentSearch.status = 'polling';
            onStateChange(this.currentSearch);

            // Calculate wait time
            const waitTime = new Date(waitUntil).getTime() - Date.now();
            const safeWaitTime = Math.max(0, waitTime);

            // Wait and then poll for results
            this.pollingTimeout = setTimeout(() => {
                this.pollResults(token, onStateChange);
            }, safeWaitTime);
        } catch (error) {
            this.currentSearch.status = 'error';
            this.currentSearch.error =
                error instanceof Error ? error.message : 'Failed to start search';
            onStateChange(this.currentSearch);
        }
    }

    private async pollResults(
        token: string,
        onStateChange: StateChangeCallback
    ): Promise<void> {
        try {
            // Try to get search results
            const { prices } = await apiClient.getSearchPrices(token);

            // Success - convert to Map
            const pricesMap = new Map(
                Object.entries(prices).map(([id, price]) => [id, price])
            );

            this.currentSearch.status = 'success';
            this.currentSearch.prices = pricesMap;
            this.currentSearch.error = null;
            onStateChange(this.currentSearch);
        } catch (error) {
            // Check if results are not ready yet (425 error)
            if (isNotReadyError(error)) {
                // Wait and retry
                const waitTime = error.waitUntil
                    ? new Date(error.waitUntil).getTime() - Date.now()
                    : 2000; // Default 2 seconds

                const safeWaitTime = Math.max(0, waitTime);

                this.pollingTimeout = setTimeout(() => {
                    this.pollResults(token, onStateChange);
                }, safeWaitTime);
            } else {
                // Other error - check retry count
                if (this.currentSearch.retryCount < this.maxRetries) {
                    this.currentSearch.retryCount++;
                    onStateChange(this.currentSearch);

                    // Retry after 1 second
                    this.pollingTimeout = setTimeout(() => {
                        this.pollResults(token, onStateChange);
                    }, 1000);
                } else {
                    // Max retries reached
                    this.currentSearch.status = 'error';
                    this.currentSearch.error =
                        error instanceof Error ? error.message : 'Failed to get search results';
                    onStateChange(this.currentSearch);
                }
            }
        }
    }

    async cancelSearch(): Promise<void> {
        // Clear timeout if exists
        if (this.pollingTimeout) {
            clearTimeout(this.pollingTimeout);
            this.pollingTimeout = null;
        }

        // Stop search on server if we have a token
        if (this.currentSearch.token) {
            try {
                await apiClient.stopSearchPrices(this.currentSearch.token);
            } catch (error) {
                // Ignore errors when cancelling
                console.warn('Failed to stop search on server:', error);
            }
        }

        // Reset state
        this.currentSearch = {
            status: 'idle',
            token: null,
            prices: null,
            error: null,
            retryCount: 0,
        };
    }

    getCurrentState(): SearchState {
        return { ...this.currentSearch };
    }
}

export const tourSearchService = new TourSearchService();