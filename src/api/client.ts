// @ts-ignore - mock-api.js is a JavaScript file without type declarations
import * as mockApi from './mock-api.js';
import type {
    CountriesMap,
    GeoResponse,
    StartSearchResponse,
    GetSearchPricesResponse,
    StopSearchResponse,
    HotelsMap,
    Hotel,
    PriceOffer,
} from './types';

class ApiClient {
    async getCountries(): Promise<CountriesMap> {
        const response = await mockApi.getCountries();
        if (!response.ok) {
            throw new Error('Failed to fetch countries');
        }
        return response.json();
    }

    async searchGeo(query?: string): Promise<GeoResponse> {
        const response = await mockApi.searchGeo(query);
        if (!response.ok) {
            throw new Error('Failed to search geo');
        }
        return response.json();
    }

    async startSearchPrices(countryID: string): Promise<StartSearchResponse> {
        try {
            const response = await mockApi.startSearchPrices(countryID);
            return response.json();
        } catch (error) {
            if (error instanceof Response) {
                const errorData = await error.json();
                throw new Error(errorData.message || 'Failed to start search');
            }
            throw error;
        }
    }

    async getSearchPrices(token: string): Promise<GetSearchPricesResponse> {
        try {
            const response = await mockApi.getSearchPrices(token);
            return response.json();
        } catch (error) {
            if (error instanceof Response) {
                const errorData = await error.json();
                throw new Error(errorData.message || 'Failed to get search prices');
            }
            throw error;
        }
    }

    async stopSearchPrices(token: string): Promise<StopSearchResponse> {
        try {
            const response = await mockApi.stopSearchPrices(token);
            return response.json();
        } catch (error) {
            if (error instanceof Response) {
                const errorData = await error.json();
                throw new Error(errorData.message || 'Failed to stop search');
            }
            throw error;
        }
    }

    async getHotels(countryID: string): Promise<HotelsMap> {
        const response = await mockApi.getHotels(countryID);
        if (!response.ok) {
            throw new Error('Failed to fetch hotels');
        }
        return response.json();
    }

    async getHotel(hotelId: number): Promise<Hotel> {
        try {
            const response = await mockApi.getHotel(hotelId);
            return response.json();
        } catch (error) {
            if (error instanceof Response) {
                const errorData = await error.json();
                throw new Error(errorData.message || 'Failed to fetch hotel');
            }
            throw error;
        }
    }

    async getPrice(priceId: string): Promise<PriceOffer> {
        try {
            const response = await mockApi.getPrice(priceId);
            return response.json();
        } catch (error) {
            if (error instanceof Response) {
                const errorData = await error.json();
                throw new Error(errorData.message || 'Failed to fetch price');
            }
            throw error;
        }
    }
}

export const apiClient = new ApiClient();