import { useRouteContext } from "@/contexts/route-context";
import React from "react";

export default function FindDestinationBtn() {
  const routeContext = useRouteContext();
  const handleClick = () => {
    if (routeContext.points === null) {
      return;
    }
    routeContext.setDirections(
      routeContext.points?.map((point) => point.latlng)
    );
  };
  return <button onClick={handleClick}> Find Route</button>;
}
