import React from 'react';
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import { useMapLoader } from '@/lib/useMapLoader';

const LocationMap = ({ selectedLocation }: { selectedLocation: any }) => {
  const { isLoaded, loadError } = useMapLoader();

  const location = {
    lat: Number(selectedLocation?.lat),
    lng: Number(selectedLocation?.lng),
  };

  const mapRef = React.useRef<any>();
  const onMapLoad = React.useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  if (loadError) return 'Error';
  if (!isLoaded) return 'Maps';

  return (
    <div style={{ marginTop: '10px' }}>
      <GoogleMap
        mapContainerStyle={{
          height: '200px',
        }}
        center={location}
        zoom={18}
        onLoad={onMapLoad}
      >
        <MarkerF
          position={location}
          options={{
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',

              // @ts-ignore
              scaledSize: {
                width: 40,
                height: 40,
              },
            },
          }}
        />
      </GoogleMap>
    </div>
  );
};

export default LocationMap;
