import Client from '../../database';
import { Order, OrderStore } from '../../models/order';
import { User, UserStore } from '../../models/user';
import { Product, ProductStore } from '../../models/product';
import { OrderDetail, OrderDetailStore } from '../../models/order_detail';

const orderStore = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();
const odStore = new OrderDetailStore();

describe('Test order model', () => {
  let order_id = 0;
  let user_id = 0;
  let product_id = 0;

  beforeAll(async () => {
    const conn = await Client.connect();
    await conn.query('truncate table orders');
    await conn.query('truncate table order_details');
    await conn.query('truncate table products');
    await conn.query('truncate table orders');
    const userData = {
      username: 'chuongle',
      first_name: 'chuong',
      last_name: 'le',
      password: 'test',
    };
    const user = await userStore.create(userData);
    user_id = user.id || 0;
    const productData = {
      name: 'sample product 1',
      price: 10,
    };
    const product = await productStore.create(productData);
    product_id = product.id || 0;
    conn.release();
  });

  it('create', async () => {
    const order = await orderStore.create({ user_id, status: 'active' });
    expect(order.user_id).toBe(user_id);
    expect(order.status).toBe('active');
    order_id = order.id || 0;
  });

  it('currentOrder', async () => {
    await odStore.create({ order_id, product_id, quantity: 2 });
    const cart = await orderStore.currentOrder(user_id);
    expect(cart.length).toBe(1);
    expect(cart[0].product_name).toBe('sample product 1');
    expect(cart[0].quantity).toBe(2);
  });
});