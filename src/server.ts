import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import productRoutes from './handlers/product';
import userRoutes from './handlers/user';
import orderRoutes from './handlers/order';

const app: express.Application = express();
const address: string = '0.0.0.0:3000';
const corsOption = {
  origin: 'http://localhost',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOption));
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
});

// product routes
productRoutes(app);
// user routes
userRoutes(app);
// order routes
orderRoutes(app);

app.listen(3000, function () {
  console.log('listening app on', address);
});

export default app;