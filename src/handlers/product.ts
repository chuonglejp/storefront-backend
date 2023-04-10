import expres, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import { verifyAuthToken } from '../middlewares/verifyToken';

const store = new ProductStore();

const index = async (req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (error) {
    console.error(`get products error. ${error}`)
    res.json(error);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    // a simple validation
    if (!id) throw new Error('invalid id');
    const product = await store.show(parseInt(id));
    res.json(product);
  } catch (error) {
    console.error(`get product error. ${error}`)
    res.json(error);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const name = req.body.name;
    const price = req.body.price;
    // a simple validation
    if (!name || !price) throw new Error(`invalid input (${name}, ${price})`);
    if (isNaN(price) || parseInt(price) <= 0) throw new Error(`invalid price`);
    
    const product = await store.create({ name, price });

    res.json(product);
  } catch (error) {
    console.error(`create product error. ${error}`)
    res.json(error);
  }
};

const sampleRoutes = (app: expres.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyAuthToken, create);
};

export default sampleRoutes;