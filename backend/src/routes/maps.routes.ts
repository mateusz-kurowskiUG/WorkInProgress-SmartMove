import { Router, Response, Request, request } from 'express';
import URLS from 'src/URLs';
import axios, { AxiosResponse } from 'axios';
import AutocompletePredictionInterface from 'src/interfaces/google_routes/AutocompleteResponse.model';
import ComputeRoutesInterface from 'src/interfaces/google_routes/computeRoutes.model';
import Location from 'src/interfaces/google_routes/Location.model';
import LatLng from 'src/interfaces/google_routes/LatLng';
import Waypoint from 'src/classes/Waypoint';
import TWaypoint from 'src/interfaces/google_routes/Waypoint.model';

const API_KEY: string = process.env.GOOGLE_MAPS_KEY || '';
const mapsRouter: Router = Router();

mapsRouter.get('/search', async (req: Request, res: Response) => {
  const { input } = req.query;
  if (!input) return res.status(400).send('No query provided');
  try {
    const url: string =
      URLS['googleFindPlace'] +
      `?query=${input}&key=${API_KEY}&fields=formatted_address%2Cname%2Cgeometry+locationbias=circle:12000@54.397398,%2018.571607`;
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
    console.log(response.data);

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

// const x = () => {};
// const y = () => {};
// const z = () => {};
const validateLatLng = (location: LatLng): boolean => {
  const { latitude, longitude } = location;
  if (!latitude || !longitude) return false;
  if (latitude < -90 || latitude > 90) return false;
  if (longitude < -180 || longitude > 180) return false;
  return true;
};

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

  const originWaypoint: Waypoint = new Waypoint(origLat, origLng);
  const destinationWaypoint: Waypoint = new Waypoint(destLat, destLng);
  const intermediatesWaypoint: TWaypoint[] = [];
  if (intermediate) {
    intermediate.forEach((intermediate: LatLng) => {
      const { latitude, longitude } = intermediate;
      if (!latitude || !longitude) return;
      if (latitude < -90 || latitude > 90) return;
      if (longitude < -180 || longitude > 180) return;
      const newWaypoint: Waypoint = new Waypoint(latitude, longitude);
      intermediatesWaypoint.push(newWaypoint.toJson());
    });
  }
  console.log(new Date().toISOString());
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
  console.dir(requestRoute, { depth: null });
  console.log(URLS['googleComputeRoute']);

  try {
    const response: AxiosResponse = await axios.post(URLS['googleComputeRoute'], requestRoute, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
      }
    });

    const { data } = response;
    console.log(data);

    return res.status(200).send(data);
  } catch (e) {
    console.log(e);

    return res.status(500).send(e);
  }
});

export default mapsRouter;
