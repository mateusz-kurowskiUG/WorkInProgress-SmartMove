import express, { Express, Request, Response } from 'express';
import { errorHandler } from './middleware/errorMiddleware';
import './environment/loadEnvironment';

const port: string = process.env.PORT || '5000';
const app: Express = express();

app.use(errorHandler);
app.use(express.json());

app.get('/hello', (req: Request, res: Response) => {
  res.send('Hello world!');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
