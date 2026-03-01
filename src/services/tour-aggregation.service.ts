import { hotelService } from './hotel.service';
import type { Tour } from '../types';
import type { PriceOffer } from '../api/types';

/**
 * Service responsible for aggregating tours data
 * Combines prices with hotel information
 * 
 * This layer separates data aggregation logic from UI components
 */
class TourAggregationService {
  /**
   * Aggregate prices with hotels to create Tour objects
   * Loads only the hotels that are needed (not all hotels in country)
   * 
   * @param prices - Map of price offers
   * @param countryID - Country ID for loading hotels
   * @returns Array of Tour objects (price + hotel)
   */
  async aggregateToursForPrices(
    prices: Map<string, PriceOffer>,
    countryID: string
  ): Promise<Tour[]> {
    if (!prices || prices.size === 0) {
      return [];
    }

    // Get unique hotel IDs from prices (filter out undefined and convert to number)
    const hotelIds = new Set<number>();
    prices.forEach((price) => {
      if (price.hotelID !== undefined) {
        const hotelIdNumber = typeof price.hotelID === 'string' 
          ? Number(price.hotelID) 
          : price.hotelID;
        hotelIds.add(hotelIdNumber);
      }
    });

    // Load hotels (this will use cache if available)
    const hotelsMap = await hotelService.getHotelsByCountry(countryID);

    // Combine prices with hotels
    const tours: Tour[] = [];
    
    prices.forEach((price) => {
      // Skip if hotelID is undefined
      if (price.hotelID === undefined) {
        return;
      }
      
      // Convert hotelID to number for Map lookup (API returns string, Map uses number)
      const hotelIdNumber = typeof price.hotelID === 'string' 
        ? Number(price.hotelID) 
        : price.hotelID;
      
      const hotel = hotelsMap.get(hotelIdNumber);
      
      if (hotel) {
        tours.push({ 
          id: price.id,
          price, 
          hotel 
        });
      }
    });

    // Sort by price (ascending)
    tours.sort((a, b) => a.price.amount - b.price.amount);

    return tours;
  }

  /**
   * Get tour by price ID
   * Useful for opening specific tour details
   * 
   * @param _priceId - Price offer ID (unused - placeholder for future implementation)
   * @param _countryID - Country ID (unused - placeholder for future implementation)
   * @returns Tour object or null
   */
  async getTourByPriceId(
    _priceId: string,
    _countryID: string
  ): Promise<Tour | null> {
    // This would typically call API to get specific price
    // For now, we'd need to search through cached data
    // This is a placeholder for future implementation
    return null;
  }
}

export const tourAggregationService = new TourAggregationService();
