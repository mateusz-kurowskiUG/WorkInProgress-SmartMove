import TWaypoint from './Waypoint.model';

interface ComputeRoutesInterface {
  origin: TWaypoint;
  destination: TWaypoint;
  intermediates: TWaypoint[];
  travelMode: 'BICYCLE';
  computeAlternativeRoutes: true;
  departureTime: string;
  languageCode: 'en-US';
  units: 'METRIC';
}
export default ComputeRoutesInterface;
