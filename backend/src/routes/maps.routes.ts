import { Router, Response, Request } from 'express';
const API_KEY: string = process.env.GOOGLE_MAPS_KEY || '';

import URLS from 'src/URLs';
import axios from 'axios';
const mapsRouter: Router = Router();

mapsRouter.get('/search', async (req: Request, res: Response) => {
  const { input } = req.query;
  if (!input) return res.status(400).send('No query provided');
  try {
    const url: string =
      URLS['googleFindPlace'] +
      `?query=${input}&key=${API_KEY}&fields=formatted_address%2Cname%2Cgeometry+locationbias=circle:12000@54.397398,%2018.571607`;
    const response = await axios.get(url);
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
      `?input=${input}&key=${API_KEY}&location=54.397398,%2018.571607&radius=1200&fields=formatted_address%2Cdescription`;
    console.log(url);
    const response = await axios.get(url);

    if (response.status !== 200) return res.status(500).send('No response from Google');
    return res.status(200).send(response.data);
  } catch (e) {
    return res.status(500).send(e);
  }
});

export default mapsRouter;
