import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

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
  const [center, setCenter] = useState(defaultLocation);
  const [hasLocation, setHasLocation] = useState(true);

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
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  if (loadError) return <p>Error</p>;
  if (!isLoaded) return <p>Loading...</p>;
  if (!hasLocation) {
    return <p>Please share your location for best experience</p>;
  }

  return (
    <GoogleMap
      id="map"
      mapContainerStyle={mapContainerStyle}
      zoom={8}
      center={center}
      onClick={(event) => {
        console.log(event);
      }}
    ></GoogleMap>
  );
};

export default Map;
