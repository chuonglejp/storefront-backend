require('../utils/env');
import expres, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
import { verifyAuthToken } from '../middlewares/verifyToken';

const { 
  JWT_SECRET
} =  process.env;

const store = new UserStore();

const index = async (req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.status(200).json(users);
  } catch (error) {
    console.error(`get users error. ${error}`);
    res.status(200).json(error);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    // a simple validation
    if (!id) throw new Error('invalid id');
    const user = await store.show(parseInt(id));
    res.status(200).json(user);
  } catch (error) {
    console.error(`get user error. ${error}`);
    res.status(200).json(error);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const username = req.body.username;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const password = req.body.password;
    console.log('user body', req.body)
    // a simple validation
    if (!username || !password) throw new Error(`invalid input`);
    const existingUser = await store.getByUsername(username);
    if (existingUser) throw new Error(`${username} already exists`);

    const user = await store.create({ username, first_name, last_name, password });
    // const token = jwt.sign({ username }, JWT_SECRET as string);

    res.status(200).json({user});
  } catch (error) {
    console.error(`create user(${req.body.username}, ${req.body.password}) error. ${error}`);
    res.status(200).json(error);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    // a simple validation
    if (!username || !password) throw new Error(`invalid input`);

    const user = await store.authenticate(username, password);
    if (user) {
      const token = jwt.sign({ username }, JWT_SECRET as string);
      res.status(200).json({token});
    } else {
    res.status(200).json({user});
    }

  } catch (error) {
    console.error(`create user(${req.body.username}, ${req.body.password}) error. ${error}`);
    res.status(200).json(error);
  }
};

const userRoutes = (app: expres.Application) => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.post('/users/add', verifyAuthToken, create);
  app.post('/users/authenticate', authenticate);
};

export default userRoutes;