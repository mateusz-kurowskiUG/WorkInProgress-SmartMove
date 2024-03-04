import axios, { AxiosError, AxiosResponse } from 'axios';
import URLS from './URLs';
import Waypoint from './classes/Waypoint';
import LatLng from './interfaces/google_routes/LatLng';
import TWaypoint from './interfaces/google_routes/Waypoint.model';
import ComputeRoutesInterface from './interfaces/google_routes/computeRoutes.model';
import StationInterface from './interfaces/mevo/Station.model';
import StationWithDistance from './interfaces/mevo/StationWithDistance';
import RouteResponse from './interfaces/google_routes/RouteResponse.model';

const API_KEY: string = process.env.GOOGLE_MAPS_KEY || '';
export const findClosest: StationWithDistance[] = (stations: StationInterface[], cords: LatLng) => {
  return stations
    .map((station: StationInterface) => {
      const distance: number = Math.sqrt(
        Math.pow(station.lat - cords.latitude, 2) + Math.pow(station.lon - cords.longitude, 2)
      );
      return { station, distance };
    })
    .sort((a: StationWithDistance, b: StationWithDistance) => a.distance - b.distance)
    .filter(({ distance }: { distance: number }) => {
      return distance < 0.0025;
    })
    .map(({ station, distance }: { station: StationInterface; distance: number }) => {
      return { station, distance: Math.floor(distance * 1000 * 111) };
    });
};
export const findRoute = async (start: LatLng, end: LatLng, inter?: LatLng[]): RouteResponse[] | AxiosError => {
  const originWaypoint: Waypoint = new Waypoint(start.latitude, start.longitude);
  const destinationWaypoint: Waypoint = new Waypoint(end.latitude, end.longitude);
  const intermediatesWaypoint: TWaypoint[] = [];
  if (inter) {
    inter.forEach((intermediate: LatLng) => {
      const { latitude, longitude } = intermediate;
      if (!latitude || !longitude) return;
      if (latitude < -90 || latitude > 90) return;
      if (longitude < -180 || longitude > 180) return;
      const newWaypoint: Waypoint = new Waypoint(latitude, longitude);
      intermediatesWaypoint.push(newWaypoint.toJson());
    });
  }
  const time: Date = new Date();
  time.setHours(time.getHours() + 2);
  const requestRoute: ComputeRoutesInterface = {
    origin: originWaypoint.toJson(),
    destination: destinationWaypoint.toJson(),
    intermediates: intermediatesWaypoint,
    travelMode: 'BICYCLE',
    computeAlternativeRoutes: true,
    departureTime: time.toISOString(),
    languageCode: 'en-US',
    units: 'METRIC'
  };
  try {
    const response: AxiosResponse = await axios.post(URLS['googleComputeRoute'], requestRoute, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
      }
    });

    console.log(1);
    const { data } = response;
    const result: RouteResponse[] = data.routes.map((route) => {
      const { duration, distanceMeters, polyline } = route;

      const newRoute: RouteResponse = {
        duration: duration.seconds,
        distance: distanceMeters,
        polyline: polyline.encodedPolyline
      };
      return newRoute;
    });
    return result;
  } catch (e: unknown) {
    return e;
  }
};

export const validateLatLng = (location: LatLng): boolean => {
  const { latitude, longitude } = location;
  if (!latitude || !longitude) return false;
  if (latitude < -90 || latitude > 90) return false;
  if (longitude < -180 || longitude > 180) return false;
  return true;
};
export const downloadStations = async (): Promise<StationInterface[] | AxiosError<unknown, any>> => {
  try {
    const response: AxiosResponse = await axios.get(URLS['mevoStations']);
    const mevos: StationInterface[] = response.data.data.stations.map((station) => {
      const fixedCords: CordsInterface[] = station.station_area.coordinates
        .flat()
        .flat()
        .map(([lat, lon]: [lat: number, lat: number]) => {
          return { lat, lon };
        });
      const newStation: StationInterface = {
        stationId: station.station_id,
        name: station.name,
        address: station.address,
        crossStreet: station.cross_street,
        lat: station.lat,
        lon: station.lon,
        isVirtualStation: station.is_virtual_station,
        capacity: station.capacity,
        stationArea: fixedCords
      };

      return newStation;
    });
    return mevos;
  } catch (e) {
    return e;
  }
};
