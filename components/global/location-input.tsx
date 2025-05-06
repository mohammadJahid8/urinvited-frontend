import { useState } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { useMapLoader } from "@/lib/useMapLoader";

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
        alert("Please select a valid location from the suggestions.");
        return;
      }

      const formattedAddress = place.formatted_address; // Includes full address shown in the dropdown
      const addressComponents = place.address_components;

      let city = "";
      let state = "";
      let zip = "";

      addressComponents.forEach((component: any) => {
        if (component.types.includes("locality")) {
          city = component.long_name;
        }
        if (component.types.includes("administrative_area_level_1")) {
          state = component.short_name;
        }
        if (component.types.includes("postal_code")) {
          zip = component.long_name;
        }
      });

      const latLng = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      setSelectedLocation(latLng);
      form.setValue(`events.${index}.latLng`, latLng);

      // Use formatted address instead of manual construction
      field.onChange(formattedAddress);
    } else {
      alert("Autocomplete is not ready yet.");
    }
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
      <Input type="text" {...field} />
    </Autocomplete>
  );
}

export default LocationInput;
