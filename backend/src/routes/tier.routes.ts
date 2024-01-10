import { Response, Request, Router } from 'express';
import axios from 'axios';
const tierRouter: Router = Router();
// get all vehicles in radius of 500 meters
tierRouter.get('/vehicles', async (req: Request, res: Response) => {
  const { lat, lon }: { lat: number; lon: number } = req.query;
  if (!lat || !lon) return res.status(400).send('No lat or lon provided');
  try {
    const resp = 1;
  } catch (e) {
    return res.status(400).send(e);
  }
  return res.status(200).send('Tier router works');
});

tierRouter.get('/test2', async (req: Request, res: Response) => {});

export default tierRouter;
