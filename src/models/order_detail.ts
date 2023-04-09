import Client from '../database';

export type OrderDetail = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
}

export class OrderDetailStore {
  async create(od: OrderDetail): Promise<OrderDetail> {
    const conn = await Client.connect();
    try {
      const sql = `insert into order_details (order_id, product_id, quantity) values($1, $2, $3) RETURNING *`;
      const result = await conn.query(sql, [od.order_id, od.product_id, od.quantity]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Create order detail error. ${error}`);
    }
  };
};
