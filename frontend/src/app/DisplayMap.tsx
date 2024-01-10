"use client";
import React, { useEffect, useMemo, useState } from "react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import axios from "axios";

const DisplayMap = () => {
  const libraries = useMemo(() => ["places"], []);
  // setting default location to Gdańsk
  const [location, setLocation] = useState({
    lat: 54.3961354,
    lng: 18.5694547,
  });
  const [input, setInput] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchLocationByName(input);
  };

  const [marker, setMarker] = useState<
    null | google.maps.LatLng | google.maps.LatLngLiteral
  >(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    setMarker(e.latLng);
  };

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
    }),
    []
  );
  const fetchLocationByName = async (location: string) => {
    const response = await axios.get(
      "http://localhost:5000/api/maps/search?input=" + location
    );
    console.log(response.data);
    setMarker(response.data.results[0].geometry.location);
    setLocation(response.data.results[0].geometry.location);
  };
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <GoogleMap
        options={mapOptions}
        zoom={14}
        center={location}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{
          height: "90vh",
          position: "fixed",
          width: "100vw",
          bottom: 0,
        }}
        onLoad={() => console.log("Map Component Loaded...")}
        onClick={(e) => {
          handleMapClick(e);
        }}
      >
        {marker && <MarkerF position={marker} />}
      </GoogleMap>
    </div>
  );
};

export default DisplayMap;
