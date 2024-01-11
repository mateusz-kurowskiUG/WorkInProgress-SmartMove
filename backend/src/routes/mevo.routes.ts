import { Request, Response, Router } from 'express';
import URLS from 'src/URLs';
import axios, { AxiosError, AxiosResponse } from 'axios';
import StationInterface from 'src/interfaces/mevo/Station.model';
import CordsInterface from 'src/interfaces/mevo/Cords.model';
import StationDetailsInterface from 'src/interfaces/mevo/StationDetails.model';
import StationWithDistance from 'src/interfaces/mevo/StationWithDistance';
const mevoRouter: Router = Router();

const downloadStations = async (): Promise<StationInterface[] | AxiosError<unknown, any>> => {
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

mevoRouter.get('/stations/closest', async (req: Request, res: Response) => {
  const { lat, lon }: { lat: number; lon: number } = req.query;
  if (!lat || !lon) return res.status(400).send('No lat or lon provided');
  try {
    const stations: StationInterface[] | AxiosError<unknown, any> = await downloadStations();

    const closestStations: StationWithDistance[] = stations
      .map((station: StationInterface) => {
        const distance: number = Math.sqrt(Math.pow(station.lat - lat, 2) + Math.pow(station.lon - lon, 2));
        return { station, distance };
      })
      .sort((a: StationWithDistance, b: StationWithDistance) => a.distance - b.distance)
      .filter(({ distance }: { distance: number }) => {
        return distance < 0.0025;
      })
      .map(({ station, distance }: { station: StationInterface; distance: number }) => {
        return { station, distance: Math.floor(distance * 1000 * 111) };
      });

    return res.status(200).send(closestStations);
  } catch (e) {
    return res.status(400).send(e);
  }
});

mevoRouter.get('/stations', async (req: Request, res: Response) => {
  try {
    const stations: StationInterface[] | AxiosError<unknown, any> = await downloadStations();
    return res.status(200).send(stations);
  } catch (e) {
    return res.status(400).send(e);
  }
});
mevoRouter.get('/stations/details/:stationId', async (req: Request, res: Response) => {
  const { stationId } = req.params;
  if (!stationId) return res.status(400).send('No stationId provided');
  try {
    const response: AxiosResponse = await axios.get(URLS['mevoStationsDetails']);
    const stationDetails = response.data.data.stations.find((station: any) => station.station_id === stationId);
    const stationResult: StationDetailsInterface = {
      stationId: stationDetails.station_id,
      isInstalled: stationDetails.is_installed,
      isRenting: stationDetails.is_renting,
      numVehiclesAvailable: stationDetails.num_bikes_available,
      numBikesAvailable: stationDetails.num_bikes_available_types,
      numDocksAvailable: stationDetails.num_docks_available,
      vehicleTypesAvailable: stationDetails.vehicle_types_available
    };
    if (!stationResult) return res.status(400).send('No station found');
    return res.status(200).send(stationResult);
  } catch (e) {
    res.status(400).send(e);
  }
});

export default mevoRouter;
