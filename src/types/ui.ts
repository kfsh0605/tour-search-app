import type { GeoEntity } from '../api/types';

// UI types for components

export interface FormState {
    selectedCountryId: string | null;
    selectedEntity: GeoEntity | null;
    searchQuery: string;
}

export interface DropdownState {
    isOpen: boolean;
    activeIndex: number;
}