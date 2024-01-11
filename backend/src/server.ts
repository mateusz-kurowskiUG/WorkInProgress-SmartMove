import express, { Express, Request, Response, Router } from 'express';
import { errorHandler } from './middleware/errorMiddleware';
import './environment/loadEnvironment';
import mevoRouter from './routes/mevo.routes';
import mapsRouter from './routes/maps.routes';
import tierRouter from './routes/tier.routes';
import cors from 'cors';
import Waypoint from './classes/Waypoint';
import TWaypoint from './interfaces/google_routes/Waypoint.model';
const port: string = process.env.PORT || '5000';

const app: Express = express();
app.use(errorHandler);
app.use(express.json());
app.use(cors());
const router: Router = Router();
router.use('/api/mevo', mevoRouter);
router.use('/api/maps', mapsRouter);
router.use('/api/tier', tierRouter);
app.use(router);
app.get('/hello', (req: Request, res: Response) => {
  res.send('Hello world!');
});

const test: Waypoint = new Waypoint(10.001223123, 12.012021);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
