import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { countryService } from '../services/country.service';
import { hotelService } from '../services/hotel.service';
import { tourSearchService } from '../services/tour-search.service';
import { geoSearchService } from '../services/geo-search.service';

interface ServicesContextValue {
    countryService: typeof countryService;
    hotelService: typeof hotelService;
    tourSearchService: typeof tourSearchService;
    geoSearchService: typeof geoSearchService;
}

const ServicesContext = createContext<ServicesContextValue | undefined>(undefined);

interface ServicesProviderProps {
    children: ReactNode;
}

/**
 * Provider component that makes services available throughout the app
 * Services are singleton instances, but encapsulated in context for better testability
 */
export function ServicesProvider({ children }: ServicesProviderProps) {
    const services: ServicesContextValue = {
        countryService,
        hotelService,
        tourSearchService,
        geoSearchService,
    };

    return (
        <ServicesContext.Provider value={services}>
            {children}
        </ServicesContext.Provider>
    );
}

/**
 * Hook to access services from context
 * @throws Error if used outside ServicesProvider
 */
export function useServices(): ServicesContextValue {
    const context = useContext(ServicesContext);
    
    if (!context) {
        throw new Error('useServices must be used within ServicesProvider');
    }
    
    return context;
}
