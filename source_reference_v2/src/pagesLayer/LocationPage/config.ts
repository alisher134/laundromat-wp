import { IntlMessages } from 'next-intl';

export type LocationKeys = keyof IntlMessages['location']['items'];

export const LOCATION_KEYS: LocationKeys[] = ['location-1', 'location-2', 'location-3'];
