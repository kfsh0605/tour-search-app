import { useMemo, createElement } from 'react';
import type { ComboboxOption } from '../components/ui';
import { getCountryFlagUrl } from '../utils';
import type { GeoEntity } from '../types';

/**
 * Hook to convert GeoEntity[] to ComboboxOption[]
 * Handles the transformation of domain entities to UI-ready format
 */
export function useGeoEntityOptions(entities: GeoEntity[]): ComboboxOption[] {
  return useMemo(() => {
    return entities.map((entity) => {
      let icon = undefined;

      if (entity.type === 'country') {
        icon = createElement('img', {
          src: getCountryFlagUrl(entity.id, 20),
          alt: entity.name,
          style: { width: '20px', height: '15px', objectFit: 'cover', borderRadius: '2px' },
        });
      } else if (entity.type === 'city' || entity.type === 'hotel') {
        icon = createElement('img', {
          src: getCountryFlagUrl(entity.countryId, 20),
          alt: '',
          style: { width: '20px', height: '15px', objectFit: 'cover', borderRadius: '2px' },
        });
      }

      return {
        id: `${entity.type}-${entity.id}`,
        label: entity.name,
        value: entity,
        icon,
        subtitle: entity.type !== 'country' 
          ? entity.type === 'city' ? 'City' : 'Hotel'
          : undefined,
      };
    });
  }, [entities]);
}
