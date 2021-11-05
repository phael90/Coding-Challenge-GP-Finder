import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const Map = ({ apiKey }) => {
  const defaultLocation = {
    lat: 55.9550393,
    lng: -3.1520545,
  };

  const request = {
    location: defaultLocation,
    radius: "1000",
    type: ["GP", "general practitioner"],
  };

  const mapContainerStyle = {
    width: "100vw",
    height: "100vh",
  };

  const libraries = ["places"];

  const [center, setCenter] = useState(defaultLocation);
  const [hasLocation, setHasLocation] = useState(true);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  const onMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  // Why useCallback?
  // The useCallback hook is used when you have a component in which the child is rerendering again and again without need.
  // can't call setMarkers directly because calling it rerenders the component and it is called again creating
  // an infinite loop. useCallback memoizes the data and prevents that
  const updateMarkers = useCallback((markerPositions) => {
    setMarkers((current) => {
      return current.concat(markerPositions);
    });
  });

  const getDoctorMarkers = (results, status) => {
    if (status == window.google.maps.places.PlacesServiceStatus.OK) {
      const markerPositions = results.map((result) => {
        return {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
        };
      });
      console.log(markerPositions);
      updateMarkers(markerPositions);
    }
  };

  // useJsApiLoader is the alternative variant of LoadScript and useLoadScript hook
  // that tries to solve the problem of "google is not defined" error by removing the cleanup routines
  // lint to issue: https://github.com/JustFly1984/react-google-maps-api/pull/143
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
  });

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

  useEffect(() => {
    if (map) {
      let service = new window.google.maps.places.PlacesService(map);
      service.nearbySearch(request, getDoctorMarkers);
    }
  }, [map]);

  if (loadError) return <p>Error</p>;
  if (!isLoaded) return <p>Loading...</p>;
  if (!hasLocation) {
    return <p>Please share your location for best experience</p>;
  }

  return (
    <GoogleMap
      id="map"
      mapContainerStyle={mapContainerStyle}
      zoom={15}
      center={center}
      onClick={(event) => {
        console.log(event);
      }}
      onLoad={onMapLoad}
    >
      {markers.map((marker) => {
        return (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={{
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(30, 30),
            }}
            onClick={() => {}}
          />
        );
      })}
    </GoogleMap>
  );
};

export default Map;
