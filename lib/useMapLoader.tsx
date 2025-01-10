import { useJsApiLoader } from '@react-google-maps/api';

export const useMapLoader = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyBSK3Pnsh-wvplEf7bac88yxhwL7EEPORM',
    libraries: ['places'],
  });

  return { isLoaded, loadError };
};
