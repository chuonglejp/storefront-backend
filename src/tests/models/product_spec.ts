import Client from '../../database';
import { Product, ProductStore } from '../../models/product';

const store = new ProductStore();

describe('Test product model', () => {
  beforeAll(async () => {
    const conn = await Client.connect();
    await conn.query('truncate table products');
    conn.release();
  });

  let id = 0;

  it('create', async () => {
    const data = {
      name: 'sample product 1',
      price: 10,
    };
    const product = await store.create(data);
    expect(product.name).toBe(data.name);
    expect(product.price).toBe(data.price);
    id = product.id || 0;
  });

  it('index', async () => {
    const products = await store.index();
    expect(products.length).toBe(1);
  });

  it('show', async () => {
    const product = await store.show(id);
    expect(product.name).toBe('sample product 1');
    expect(product.price).toBe(10);
  });

  it('delete', async () => {
    const product = await store.delete(id);
    expect(product.name).toBe('sample product 1');
    expect(product.price).toBe(10);
  });
});