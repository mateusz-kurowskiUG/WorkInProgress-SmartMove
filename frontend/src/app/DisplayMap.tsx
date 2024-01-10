"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";

const DisplayMap = () => {
  const libraries = useMemo(() => ["places"], []);
  const [location, setLocation] = useState({
    lat: 54.3961354,
    lng: 18.5694547,
  });
  const [response, setResponse] = useState<google.maps.DirectionsResult | null>(
    null,
  );
  const directionsCallback = useCallback(
    (
      result: google.maps.DirectionsResult | null,
      status: google.maps.DirectionsStatus,
    ) => {
      if (result !== null) {
        if (status === "OK") {
          setResponse(result);
        } else {
          console.log("response: ", result);
        }
      }
    },
    [],
  );
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
    }),
    [],
  );

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ lat: latitude, lng: longitude });
      });
    }
  }, []);
  const directionsResult = useMemo(() => {
    return {
      directions: response,
    };
  }, [response]);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }
  const directionsServiceOptions: google.maps.DirectionsRequest = {
    origin: "Gdansk Science and Technology Park",
    destination: "University of Gdansk",
    travelMode: google.maps.TravelMode.BICYCLING,
  };

  return (
    <div>
      <div>
        <p>This is Sidebar...</p>
      </div>
      <GoogleMap
        options={mapOptions}
        zoom={14}
        center={location}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: "800px", height: "800px" }}
        onLoad={() => console.log("Map Component Loaded...")}
      >
        <DirectionsService
          options={directionsServiceOptions}
          callback={directionsCallback}
        />
        <MarkerF position={location} />
        {directionsResult.directions && (
          <>
            <div>Direction</div>
            <DirectionsRenderer options={directionsResult} />
          </>
        )}
      </GoogleMap>
    </div>
  );
};

export default DisplayMap;
