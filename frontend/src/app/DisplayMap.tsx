"use client";
import React, { useEffect, useMemo, useState } from "react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import axios from "axios";

const DisplayMap = () => {
  const libraries = useMemo(() => ["places"], []);
  const [location, setLocation] = useState({
    lat: 54.3961354,
    lng: 18.5694547,
  });

  const [marker, setMarker] = useState<
    null | google.maps.LatLng | google.maps.LatLngLiteral
  >(null);
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

    const fetchLocationByName = async (location: string) => {
      const response = await axios.get(
        "http://localhost:5000/api/maps/search/?input=" + location,
      );
      setMarker(response.data.results[0].geometry.location);
    };

    fetchLocationByName("Gdańsk");
  }, []);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }
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
        {marker && <MarkerF position={marker} />}
      </GoogleMap>
    </div>
  );
};

export default DisplayMap;
