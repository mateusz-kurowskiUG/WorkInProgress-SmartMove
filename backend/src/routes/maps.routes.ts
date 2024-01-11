import { Router, Response, Request } from 'express';
import URLS from 'src/URLs';
import axios, { AxiosResponse } from 'axios';
import AutocompletePredictionInterface from 'src/interfaces/google_routes/AutocompleteResponse.model';
import LatLng from 'src/interfaces/google_routes/LatLng';
import { downloadStations, findClosest, findRoute, validateLatLng } from 'src/utils';
import StationInterface from 'src/interfaces/mevo/Station.model';
import StationWithDistance from 'src/interfaces/mevo/StationWithDistance';
import RouteResponse from 'src/interfaces/google_routes/RouteResponse.model';

const API_KEY: string = process.env.GOOGLE_MAPS_KEY || '';
const mapsRouter: Router = Router();

mapsRouter.get('/search', async (req: Request, res: Response) => {
  const { input } = req.query;
  if (!input) return res.status(400).send('No query provided');
  try {
    const url: string =
      URLS['googleFindPlace'] +
      `?query=${input}&key=${API_KEY}&fields=formatted_address%2Cname%2Cgeometry&locationbias=circle:12000@54.397398,%2018.571607`;
    const response: AxiosResponse = await axios.get(url);
    return res.status(200).send(response.data);
  } catch (e) {
    return res.status(500).send(e);
  }
});
mapsRouter.get('/autocomplete', async (req: Request, res: Response) => {
  const { input } = req.query;
  if (!input) return res.status(400).send('No query provided');
  try {
    const url: string =
      URLS['googleAutoComplete'] +
      `?input=${input}&key=${API_KEY}&radius=1200&locationrestriction=circle:12000@54.397398%2018.571607&fields=formatted_address%2Cdescription";//`;
    const response: AxiosResponse = await axios.get(url);

    if (response.status !== 200) return res.status(500).send('No response from Google');

    const predictions: google.maps.places.AutocompletePrediction[] = response.data.predictions;
    const ourPreds: AutocompletePredictionInterface[] = predictions.map(
      (prediction: google.maps.places.AutocompletePrediction) => {
        const { description, place_id, reference } = prediction;
        const { main_text, secondary_text } = prediction.structured_formatting;
        const newPred: AutocompletePredictionInterface = {
          description,
          placeId: place_id,
          reference,
          mainText: main_text,
          secondaryText: secondary_text
        };
        return newPred;
      }
    );
    return res.status(200).send(ourPreds);
  } catch (e) {
    return res.status(500).send(e);
  }
});

const aToBWithMevo = async (A: LatLng, B: LatLng, inter: LatLng[] | undefined): RouteResponse[] => {
  const stations: StationInterface[] = await downloadStations();

  const aMevo: StationInterface = findClosest(stations, A)
    .map((station: StationWithDistance) => station.station)
    .slice(0, 1)[0];

  const bMevo: StationInterface = findClosest(stations, B)
    .map((station: StationWithDistance) => station.station)
    .slice(0, 1)[0];
  const aMevoLatLng: LatLng = { latitude: aMevo.lat, longitude: aMevo.lon };
  const bMevoLatLng: LatLng = { latitude: bMevo.lat, longitude: bMevo.lon };
  if (!inter) return await findRoute(aMevoLatLng, bMevoLatLng, [A, B]);
  return await findRoute(aMevoLatLng, bMevoLatLng, [A, ...inter, B]);
};
// const z = () => {};

mapsRouter.post('/route', async (req: Request, res: Response) => {
  const { origin, destination, intermediate, rented, chosenMeans } = req.body;
  if (!origin || !destination) return res.status(400).send('No origin or destination provided');
  const origLat: number = origin.lat;
  const origLng: number = origin.lng;
  const destLat: number = destination.lat;
  const destLng: number = destination.lng;
  if (!origLng || !origLat || !destLng || !destLat) return res.status(400).send('No origin or destination provided');

  const destCords: LatLng = {
    latitude: destLat,
    longitude: destLng
  };
  const origCords: LatLng = {
    latitude: origLat,
    longitude: origLng
  };
  if (!validateLatLng(destCords) || !validateLatLng(origCords))
    return res.status(400).send('Invalid origin or destination provided');

  if (!rented && !chosenMeans) return res.status(400).send('No chosen means provided');
  try {
    const result: RouteResponse[] = await findRoute(origCords, destCords, intermediate);
    return res.status(200).send(result);
  } catch (e) {
    return res.status(500).send(e);
  }
});

export default mapsRouter;
