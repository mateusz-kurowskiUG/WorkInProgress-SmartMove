import express, { Express, Request, Response, Router } from 'express';
import { errorHandler } from './middleware/errorMiddleware';
import './environment/loadEnvironment';
import mevoRouter from './routes/mevo.routes';
import mapsRouter from './routes/maps.routes';
import cors from 'cors';
const port: string = process.env.PORT || '5000';

const app: Express = express();
app.use(errorHandler);
app.use(express.json());
app.use(cors());
const router: Router = Router();
router.use('/api/mevo', mevoRouter);
router.use('/api/maps', mapsRouter);
app.use(router);
app.get('/hello', (req: Request, res: Response) => {
  res.send('Hello world!');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
