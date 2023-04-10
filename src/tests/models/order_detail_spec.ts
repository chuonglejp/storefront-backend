import Client from '../../database';
import { OrderDetail, OrderDetailStore } from '../../models/order_detail';

const store = new OrderDetailStore();

describe('Test order detail model', () => {
  beforeAll(async () => {
    const conn = await Client.connect();
    await conn.query('truncate table order_details');
    conn.release();
  });

  it('create', async () => {
    const od = await store.create({ order_id: 1, product_id: 3, quantity: 2 });
    expect(od.order_id).toBe(1);
    expect(od.product_id).toBe(3);
    expect(od.quantity).toBe(2);
  });
});