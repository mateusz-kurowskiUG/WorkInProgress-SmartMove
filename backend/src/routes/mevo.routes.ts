import { Request, Response, Router } from 'express';
import URLS from 'src/URLs';
import axios, { AxiosError, AxiosResponse } from 'axios';
import StationInterface from 'src/interfaces/mevo/Station.model';
import CordsInterface from 'src/interfaces/mevo/Cords.model';
import StationDetailsInterface from 'src/interfaces/mevo/StationDetails.model';
import StationWithDistance from 'src/interfaces/mevo/StationWithDistance';
import LocationLocationInterface from 'src/interfaces/google_routes/Location.model';
import LatLng from 'src/interfaces/google_routes/LatLng';
import { downloadStations, findClosest } from 'src/utils';
const mevoRouter: Router = Router();

mevoRouter.get('/stations/closest', async (req: Request, res: Response) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).send('No lat or lon provided');
  try {
    const stations: StationInterface[] = downloadStations();

    const closestStations: StationWithDistance[] = findClosest(stations, { latitude: lat, longitude: lon });

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
