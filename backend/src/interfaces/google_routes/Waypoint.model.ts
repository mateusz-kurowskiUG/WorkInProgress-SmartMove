import LocationLocationInterface from './Location.model';

type TWaypoint = WaypointInterface & TUnionWaypoint;
interface WaypointInterface {
  via: false;
  vehicleStopover: boolean;
}

type TUnionWaypoint = LocationInterface | PlaceIdInterface | AddressInterface;
interface LocationInterface {
  location: LocationLocationInterface;
}
interface PlaceIdInterface {
  placeId: string;
}
interface AddressInterface {
  address: string;
}

export default TWaypoint;
