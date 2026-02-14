import { useState, useCallback, useEffect } from 'react';
import { tourSearchService } from '../services';
import type { SearchState } from '../types';

export function useTourSearch() {
    const [state, setState] = useState<SearchState>({
        status: 'idle',
        token: null,
        prices: null,
        error: null,
        retryCount: 0,
    });

    const startSearch = useCallback(async (countryID: string) => {
        await tourSearchService.startSearch(countryID, (newState) => {
            console.log('📢 State update from service:', newState);
            setState({ ...newState }); // Create new object to trigger re-render
        });
    }, []);

    const cancelSearch = useCallback(async () => {
        await tourSearchService.cancelSearch();
        setState({
            status: 'idle',
            token: null,
            prices: null,
            error: null,
            retryCount: 0,
        });
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            tourSearchService.cancelSearch();
        };
    }, []);

    return {
        ...state,
        startSearch,
        cancelSearch,
        isSearching: state.status === 'searching',
        hasResults: state.status === 'ready' && state.prices !== null,
        hasError: state.status === 'error',
    };
}