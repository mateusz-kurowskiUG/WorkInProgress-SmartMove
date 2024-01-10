type TWaypoint = WaypointInterface & TUnionWaypoint;
interface WaypointInterface {
  via: boolean;
  vehicleStopover: boolean;
  sideOfRoad: '';
}

type TUnionWaypoint = LocationInterface | PlaceIdInterface | AddressInterface;
interface LocationInterface {
  location: string;
}
interface PlaceIdInterface {
  placeId: string;
}
interface AddressInterface {
  address: string;
}

export default TWaypoint;
