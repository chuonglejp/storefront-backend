import Client from '../database';
import supertest from 'supertest';
import app from '../server';
import { Order, OrderStore } from '../models/order';
import { User, UserStore } from '../models/user';
import { Product, ProductStore } from '../models/product';
import { OrderDetail, OrderDetailStore } from '../models/order_detail';

const orderStore = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();
const odStore = new OrderDetailStore();
let request = supertest(app);

describe('Test user APIs', () => {
  let jwt = '';
  let user_id = 0;

  beforeAll(async () => {
    const conn = await Client.connect();
    await conn.query('truncate table users');
    conn.release();

    const data = {
      username: 'chuongle',
      first_name: 'chuong',
      last_name: 'le',
      password: 'test',
    };
    const user = await userStore.create(data);
    user_id = user.id || 0;
  });

  it('authenticate user', async () => {
    const res = await request.post('/users/authenticate').send({username: 'chuongle', password: 'test'});
    expect(res.status).toBe(200);
    jwt = res.body.token;
  });

  it('get all users', async () => {
    const res = await request
      .get('/users')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${jwt}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].username).toBe('chuongle');
  });

  it('get an user', async () => {
    const res = await request
      .get(`/users/${user_id}`)
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${jwt}`);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('chuongle');
  });

  it('create an user', async () => {
    const res = await request
      .post(`/users/add`)
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${jwt}`)
      .send({username: 'torale', first_name: 'tora', last_name: 'le', password: '1234'});
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('torale');
  });
});

describe('Test product APIs', () => {
  let jwt = '';
  let user_id = 0;
  let product_id = 0;

  beforeAll(async () => {
    const conn = await Client.connect();
    await conn.query('truncate table users');
    await conn.query('truncate table products');
    conn.release();

    const data = {
      username: 'chuongle',
      first_name: 'chuong',
      last_name: 'le',
      password: 'test',
    };
    const user = await userStore.create(data);
    user_id = user.id || 0;

    const res = await request.post('/users/authenticate').send({username: 'chuongle', password: 'test'});
    expect(res.status).toBe(200);
    jwt = res.body.token;
  });

  it('create a product', async () => {
    const res = await request
      .post('/products')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${jwt}`)
      .send({name: 'sample product 1', price: 20});
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('sample product 1');
    expect(res.body.price).toBe(20);
    product_id = res.body.id;
  });

  it('get a product', async () => {
    const res = await request.get(`/products/${product_id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('sample product 1');
    expect(res.body.price).toBe(20);
  });

  it('get all product', async () => {
    const res = await request.get(`/products`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('sample product 1');
    expect(res.body[0].price).toBe(20);
  });
});

describe('Test order APIs', () => {
  let jwt = '';
  let user_id = 0;
  let product_id = 0;

  beforeAll(async () => {
    const conn = await Client.connect();
    await conn.query('truncate table users');
    await conn.query('truncate table orders');
    await conn.query('truncate table order_details');
    await conn.query('truncate table products');
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

    const res = await request.post('/users/authenticate').send({username: 'chuongle', password: 'test'});
    expect(res.status).toBe(200);
    jwt = res.body.token;
  });

  it('add a product to cart', async () => {
    const res = await request
      .post('/orders/add-to-cart')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${jwt}`)
      .send({user_id, product_id, quantity: 3});
    expect(res.status).toBe(200);
    expect(res.body[0].product_name).toBe('sample product 1');
    expect(res.body[0].quantity).toBe(3);
  });

  it('get current order', async () => {
    const res = await request
      .post('/orders')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${jwt}`)
      .send({user_id});
    expect(res.status).toBe(200);
    expect(res.body[0].product_name).toBe('sample product 1');
    expect(res.body[0].quantity).toBe(3);
  });
});