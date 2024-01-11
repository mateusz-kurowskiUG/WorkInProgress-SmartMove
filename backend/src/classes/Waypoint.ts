import TWaypoint from 'src/interfaces/google_routes/Waypoint.model';

class Waypoint {
  private lat: number;
  private lng: number;
  public constructor(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng;
  }
  public toJson(): TWaypoint {
    return {
      via: false,
      vehicleStopover: false,
      location: {
        latLng: {
          latitude: this.lat,
          longitude: this.lng
        },
        heading: 0
      }
    };
  }
}
export default Waypoint;
