export type LocationKey = 'location-1' | 'location-2' | 'location-3';

export const LOCATION_KEYS: LocationKey[] = ['location-1', 'location-2', 'location-3'];

export interface LocationData {
  id: number;
  key: LocationKey;
}

export const LOCATIONS_DATA: LocationData[] = [
  { id: 1, key: 'location-1' },
  { id: 2, key: 'location-2' },
  { id: 3, key: 'location-3' },
];
