import { apiClient } from '../api';
import type { Hotel } from '../types';

class HotelService {
    private hotelsByCountry = new Map<string, Map<number, Hotel>>();

    async getHotelsByCountry(countryID: string): Promise<Map<number, Hotel>> {
        if (this.hotelsByCountry.has(countryID)) {
            return this.hotelsByCountry.get(countryID)!;
        }

        const data = await apiClient.getHotels(countryID);
        const hotelsMap = new Map(
            Object.entries(data).map(([id, hotel]) => [Number(id), hotel])
        );

        this.hotelsByCountry.set(countryID, hotelsMap);
        return hotelsMap;
    }

    async getHotel(hotelId: number): Promise<Hotel> {
        return apiClient.getHotel(hotelId);
    }

    clearCache(): void {
        this.hotelsByCountry.clear();
    }
}

export const hotelService = new HotelService();