import { create } from 'zustand';
import { tourSearchService } from '../services';
import type { SearchState } from '../types';

interface TourSearchStore extends SearchState {
  // Actions
  startSearch: (countryID: string) => Promise<void>;
  cancelSearch: () => void;
  reset: () => void;
  
  // Computed
  isSearching: boolean;
  hasResults: boolean;
  hasError: boolean;
}

const initialState: SearchState = {
  status: 'idle',
  token: null,
  prices: null,
  error: null,
  retryCount: 0,
};

/**
 * Zustand store for tour search state management
 * Wraps TourSearchService and manages state through callbacks
 */
export const useTourSearchStore = create<TourSearchStore>((set, get) => ({
  ...initialState,
  
  // Computed properties
  get isSearching() {
    const status = get().status;
    return status === 'searching' || status === 'polling';
  },
  
  get hasResults() {
    return get().status === 'success' && get().prices !== null;
  },
  
  get hasError() {
    return get().status === 'error';
  },
  
  // Actions
  startSearch: async (countryID: string) => {
    try {
      // Reset state
      set({ 
        status: 'searching', 
        token: null, 
        prices: null, 
        error: null, 
        retryCount: 0 
      });
      
      // Start search with callback that updates store
      await tourSearchService.startSearch(countryID, (state) => {
        set(state);
      });
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to start search',
      });
    }
  },
  
  cancelSearch: async () => {
    await tourSearchService.cancelSearch();
    set({ status: 'idle', token: null, prices: null, error: null });
  },
  
  reset: () => {
    set(initialState);
  },
}));
