import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  useJsApiLoader,
} from "@react-google-maps/api";
import ReactGooglePlacesSuggest from "react-google-places-suggest";

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const libraries = ["places"];

const Map = ({ apiKey }) => {
  const defaultLocation = {
    lat: 55.9550393,
    lng: -3.1520545,
  };

  const request = {
    location: defaultLocation,
    radius: "500",
    type: ["restaurant"],
  };

  const [center, setCenter] = useState(defaultLocation);
  const [hasLocation, setHasLocation] = useState(true);
  const googleMapRef = useRef(null);
  useEffect(() => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition((userLocation) => {
        setCenter({
          lat: userLocation.coords?.latitude,
          lng: userLocation.coords?.longitude,
        });
      });
    } else {
      setHasLocation(false);
    }
  }, []);

  // useJsApiLoader is the alternative variant of LoadScript and useLoadScript hook
  // that tries to solve the problem of "google is not defined" error by removing the cleanup routines
  // lint to issue: https://github.com/JustFly1984/react-google-maps-api/pull/143
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
  });

  if (loadError) return <p>Error</p>;
  if (!isLoaded) return <p>Loading...</p>;
  if (!hasLocation) {
    return <p>Please share your location for best experience</p>;
  }

  let service = new window.google.maps.places.PlacesService(googleMapRef);
  console.log(service);
  return (
    <GoogleMap
      id="map"
      mapContainerStyle={mapContainerStyle}
      zoom={15}
      center={center}
      onClick={(event) => {
        console.log(event);
      }}
      ref={googleMapRef}
    ></GoogleMap>
  );
};

export default Map;
