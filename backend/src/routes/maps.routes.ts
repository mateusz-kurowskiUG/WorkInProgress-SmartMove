import { Router, Response, Request } from 'express';
import URLS from 'src/URLs';
import axios, { AxiosResponse } from 'axios';
import AutocompletePredictionInterface from 'src/interfaces/google_routes/AutocompleteResponse.model';

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

export default mapsRouter;
