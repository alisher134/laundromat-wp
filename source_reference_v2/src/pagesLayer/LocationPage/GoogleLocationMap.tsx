'use client';

import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { useCallback, useMemo } from 'react';
import { BUSINESS_LOCATIONS } from '@/shared/config/seo.config';
import { cn } from '@/shared/libs/cn';

interface GoogleLocationMapProps {
  activeLocationId: number | null;
  onLocationSelect: (id: number) => void;
  className?: string;
}

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '12px',
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'all',
      elementType: 'geometry',
      stylers: [{ saturation: -30 }],
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [{ color: '#87BCE0' }],
    },
  ],
};

export const GoogleLocationMap = ({ activeLocationId, onLocationSelect, className }: GoogleLocationMapProps) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const center = useMemo(
    () => ({
      lat: BUSINESS_LOCATIONS[0].geo.latitude,
      lng: BUSINESS_LOCATIONS[0].geo.longitude,
    }),
    [],
  );

  const onMarkerClick = useCallback(
    (index: number) => {
      onLocationSelect(index + 1);
    },
    [onLocationSelect],
  );

  if (loadError) {
    return (
      <div
        className={cn(
          'rounded-card bg-brand-bg/20 relative flex h-[408px] w-full items-center justify-center md:order-2 md:h-[409px] md:flex-1 xl:h-[474px] 2xl:h-[786px]',
          className,
        )}
      >
        <p className="text-text/50">Error loading map</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={cn(
          'rounded-card bg-brand-bg/20 relative flex h-[408px] w-full items-center justify-center md:order-2 md:h-[409px] md:flex-1 xl:h-[474px] 2xl:h-[786px]',
          className,
        )}
      >
        <div className="border-brand size-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative h-[408px] w-full overflow-hidden md:order-2 md:h-[409px] md:flex-1 xl:h-[474px] 2xl:h-[786px]',
        'rounded-card',
        className,
      )}
    >
      <GoogleMap center={center} mapContainerStyle={containerStyle} options={mapOptions} zoom={10}>
        {BUSINESS_LOCATIONS.map((location, index) => (
          <MarkerF
            icon={{
              url: activeLocationId === index + 1 ? '/images/marker-active.svg' : '/images/marker.svg',
              scaledSize: new google.maps.Size(40, 40),
            }}
            key={location.id}
            onClick={() => onMarkerClick(index)}
            position={{ lat: location.geo.latitude, lng: location.geo.longitude }}
          />
        ))}
      </GoogleMap>
    </div>
  );
};
