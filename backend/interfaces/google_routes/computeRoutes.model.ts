import WaypointInterface from "./Waypoint.model";

interface computeRoutesInterface {
  origin: WaypointInterface;
  destination: WaypointInterface;
  intermediates: WaypointInterface[];
  travelMode: "BICYCLE";
  routingPreference: "TRAFFIC_AWARE";
  // departureTime: string;
  // arrivalTime: string;
  union: UnionWaypoint;
}
export default computeRoutesInterface;
