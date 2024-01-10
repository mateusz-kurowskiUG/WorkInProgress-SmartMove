import WaypointInterface from './Waypoint.model';

interface ComputeRoutesInterface {
  origin: WaypointInterface;
  destination: WaypointInterface;
  intermediates: WaypointInterface[];
  travelMode: 'BICYCLE';
  routingPreference: 'TRAFFIC_AWARE';
}
export default ComputeRoutesInterface;
