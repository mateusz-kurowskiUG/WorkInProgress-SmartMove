import { Request, Response, Router } from 'express';
import URLS from 'src/URLs';
import axios, { AxiosResponse } from 'axios';
import StationInterface from 'src/interfaces/mevo/Station.model';
import CordsInterface from 'src/interfaces/mevo/Cords.model';
import StationDetailsInterface from 'src/interfaces/mevo/StationDetails.model';
const mevoRouter: Router = Router();

mevoRouter.get('/stations', async (req: Request, res: Response) => {
  try {
    const response: AxiosResponse = await axios.get(URLS['mevoStations']);
    // console.log(response.data);
    const mevos: StationInterface[] = response.data.data.stations.map((station) => {
      const fixedCords: CordsInterface = station.station_area.coordinates
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
    return res.status(200).send(mevos);
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
