type WaypointType = WaypointInterface & UnionWaypoint;
interface WaypointInterface {
  via: boolean;
  vehicleStopover: boolean;
  sideOfRoad: "";
}

type UnionWaypoint = LocationInterface | PlaceIdInterface | AddressInterface;
interface LocationInterface {
  location: string;
}
interface PlaceIdInterface {
  placeId: string;
}
interface AddressInterface {
  address: string;
}

export default WaypointInterface;
