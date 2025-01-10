import { useState } from 'react';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { useMapLoader } from '@/lib/useMapLoader';

function LocationInput({
  setSelectedLocation,
  field,
  form,
  index,
}: {
  setSelectedLocation: any;
  field: any;
  form: any;
  index: any;
}) {
  const [autocomplete, setAutocomplete] = useState<any>(null);

  const { isLoaded } = useMapLoader();

  function onLoad(autocompleteInstance: any) {
    // Store the autocomplete instance when the Autocomplete component is loaded
    setAutocomplete(autocompleteInstance);
  }

  function onPlaceChanged() {
    if (autocomplete != null) {
      const place = autocomplete.getPlace();
      if (!place || !place.geometry) {
        alert('Please select a valid location from the suggestions.');
        return;
      }

      const name = place.name;

      // Extract city, state, and zip code from address_components
      const addressComponents = place.address_components;
      let city = '';
      let state = '';
      let zip = '';

      addressComponents.forEach((component: any) => {
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
          state = component.short_name;
        }
        if (component.types.includes('postal_code')) {
          zip = component.long_name;
        }
      });

      console.log(`City: ${city}, State: ${state}, Zip: ${zip}`);

      const latLng = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        // city: city,
        // state: state,
        // zip: zip,
      };
      setSelectedLocation(latLng);

      form.setValue(`events.${index}.latLng`, latLng);

      field.onChange(`${name}, ${city}, ${state}, ${zip}`);
    } else {
      alert('Autocomplete is not ready yet.');
    }
  }

  console.log({ field });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
      <Input type='text' {...field} />
    </Autocomplete>
  );
}

export default LocationInput;
