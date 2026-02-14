// Mapping of country IDs to flag codes
export const COUNTRY_FLAG_CODES: Record<string, string> = {
    '115': 'tr', // Turkey
    '43': 'eg',  // Egypt
    '34': 'gr',  // Greece
};

/**
 * Get flag URL for a country
 * @param countryId - Country ID
 * @param size - Flag size (default: 40)
 * @returns Flag URL or placeholder if country not found
 */
export function getCountryFlagUrl(countryId: string, size: number = 40): string {
    const flagCode = COUNTRY_FLAG_CODES[countryId];
    
    if (!flagCode) {
        // Return placeholder or empty image if country not found
        return `https://flagcdn.com/w${size}/xx.png`;
    }
    
    return `https://flagcdn.com/w${size}/${flagCode}.png`;
}
