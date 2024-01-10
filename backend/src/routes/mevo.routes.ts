import { Request, Response, Router } from 'express';
import URLS from 'src/URLs';

const mevoRouter: Router = Router();

mevoRouter.get('/stations', async (req: Request, res: Response): Promise<any> => {
  return res.send('Hello from Mevo!');
});

export default mevoRouter;
