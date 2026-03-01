// Base entities
export interface Country {
    id: string;
    name: string;
    flag: string;
}

export interface City {
    id: number;
    name: string;
    countryId: string;
}

export interface Hotel {
    id: number;
    name: string;
    img: string;
    cityId: number;
    cityName: string;
    countryId: string;
    countryName: string;
    description?: string;
    services?: HotelServices;
}

export interface HotelServices {
    wifi?: string;
    aquapark?: string;
    tennis_court?: string;
    laundry?: string;
    parking?: string;
}

// Collections as dictionaries
export type CountriesMap = Record<string, Country>;
export type CitiesMap = Record<string, City>;
export type HotelsMap = Record<string, Hotel>;

// Price search (offer)
export interface PriceOffer {
    id: string;
    amount: number;
    currency: 'usd';
    startDate: string;
    endDate: string;
    hotelID?: number | string; // Can be number or string from API
}

// Price search response
export type PricesMap = Record<string, PriceOffer>;

// Geo search suggestions
export type GeoEntity =
    | (Country & { type: 'country' })
    | (City & { type: 'city' })
    | (Hotel & { type: 'hotel' });

export type GeoResponse = Record<string, GeoEntity>;

// API errors
export interface ErrorResponse {
    code: number;
    error: true;
    message: string;
    waitUntil?: string;
}

// Successful special responses
export interface StartSearchResponse {
    token: string;
    waitUntil: string;
}

export interface GetSearchPricesResponse {
    prices: PricesMap;
}

export interface StopSearchResponse {
    message: string;
}