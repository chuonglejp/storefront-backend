import expres, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/order';
import { OrderDetail, OrderDetailStore } from '../models/order_detail';
import { verifyAuthToken } from '../middlewares/verifyToken';

const orderStore = new OrderStore();
const orderDetailStore = new OrderDetailStore();

// current cart(order status = active)
const currentOrder = async (req: Request, res: Response) => {
  try {
    const user_id = req.params.id;
    if (!user_id) throw new Error('invalid id');
    const order = await orderStore.currentOrder(parseInt(user_id));
    res.json(order);
  } catch (error) {
    console.error(`get current order error. ${error}`)
    res.json(error);
  }
};

const addToCart = async (req: Request, res: Response) => {
  try {
    const {
      user_id, // should get from jwt
      product_id,
      quantity,
    } = req.body;
    // a very simple validation
    if (!user_id || !product_id || !quantity) throw new Error('invalid input');

    // get or create order_id
    const cart = await orderStore.currentOrder(parseInt(user_id));
    let order_id: number;
    if (!cart || !cart.length) {
      const order = await orderStore.create({ user_id, status: 'active' });
      if (!order.id) throw new Error('invalid order');
      order_id = order.id;
    } else {
      order_id = cart[0].order_id;
    }

    // add product to current cart
    // TODO check if product already in the cart
    await orderDetailStore.create({ order_id, product_id, quantity });
    const order = await orderStore.currentOrder(parseInt(user_id));

    res.json(order);
  } catch (error) {
    console.error(`add to cart error. ${error}`)
    res.json(error);
  }
};

const orderRoutes = (app: expres.Application) => {
  app.get('/orders', verifyAuthToken, currentOrder);
  app.post('/add-to-cart', verifyAuthToken, addToCart);
};

export default orderRoutes;