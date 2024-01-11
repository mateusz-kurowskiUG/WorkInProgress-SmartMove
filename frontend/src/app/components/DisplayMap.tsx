"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  GoogleMap,
  MarkerF,
  PolylineF,
  useLoadScript,
} from "@react-google-maps/api";
import axios from "axios";
import { useRouteContext } from "@/contexts/route-context";

const DisplayMap = () => {
  const routeContext = useRouteContext();
  const libraries = useMemo(() => ["places", "geometry"], []);
  // setting default location to Gdańsk
  const [location, setLocation] = useState<google.maps.LatLng | any>({
    lat: 54.3961354,
    lng: 18.5694547,
  });

  const [mapClick, setMapClick] = useState<google.maps.LatLng | null>(null);
  const [path, setPath] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  // const handleMapClick = (e: google.maps.MapMouseEvent) => {
  //   if (mapClick === null) {
  //     setMapClick(e.latLng);
  //     routeContext.setStartPoint(e.latLng);
  //   } else {
  //     routeContext.setEndPoint(e.latLng);
  //   }
  // };

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
    setLocation(response.data.results[0].geometry.location);
  };

  const sfPolygonOptions = {
    fillColor: "#FF5500",
    fillOpacity: 1,
    strokeColor: "#FF7700",
    strokeOpacity: 1,
    strokeWeight: 2,
    clickable: false,
    draggable: false,
    editable: false,
    geodesic: false,
    zIndex: 1,
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  useMemo(async () => {
    if (routeContext.points && routeContext.points.length > 1) {
      const response = await axios.post(
        "http://localhost:5000/api/maps/route",
        {
          origin: routeContext.points[routeContext.points.length - 1],
          destination: routeContext.points[0],
          intermediary: routeContext.points.slice(1, -1),
          rented: true,
        }
      );
      setPath(response.data[0]);
      setLocation(routeContext.points[0]);
    }
  }, [routeContext.points]);

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
          height: "80vh",
          position: "absolute",
          width: "100vw",
          bottom: 0,
          left: 0,
        }}
        onLoad={() => console.log("Map Component Loaded...")}
        onClick={(e) => {
          // handleMapClick(e);
        }}
      >
        {path && (
          <PolylineF
            path={google.maps.geometry.encoding.decodePath(path.polyline)}
          />
        )}
        {routeContext.points &&
          routeContext.points.map((point, index) => (
            <MarkerF key={index} position={point} />
          ))}
      </GoogleMap>
    </div>
  );
};

export default DisplayMap;
