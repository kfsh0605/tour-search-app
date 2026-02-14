import type { Hotel, PriceOffer } from '../api/types';

// Domain types for business logic

export interface Tour {
    id: string;
    hotel: Hotel;
    price: PriceOffer;
}

export type SearchStatus = 'idle' | 'searching' | 'ready' | 'error';

export interface SearchState {
    status: SearchStatus;
    token: string | null;
    prices: Map<string, PriceOffer> | null;
    error: string | null;
    retryCount: number;
}