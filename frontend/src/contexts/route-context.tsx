"use client";

import { createContext, useContext, useState } from "react";

interface RouteContextProviderProps {
  children: React.ReactNode;
}

interface RouteContextType {
  points: google.maps.LatLng[] | null;
  setPoints: React.Dispatch<React.SetStateAction<google.maps.LatLng[] | null>>;
}

const RouteContext = createContext<RouteContextType | null>(null);

export const useRouteContext = (): RouteContextType => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error(
      "useRouteContext must be used within a RouteContextProvider"
    );
  }
  return context;
};

export default function RouteContextProvider({
  children,
}: RouteContextProviderProps): JSX.Element {
  const [points, setPoints] = useState<google.maps.LatLng[] | null>(null);

  return (
    <RouteContext.Provider value={{ points, setPoints }}>
      {children}
    </RouteContext.Provider>
  );
}
