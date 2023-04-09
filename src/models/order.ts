import Client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  status: 'active' | 'complete';
}

export type Cart = {
  id: number,
  user_id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
}

export class OrderStore {
  async currentOrder(user_id: number): Promise<Cart[]> {
    const conn = await Client.connect();
    try {
      const sql = `
        select od.id, o.user_id, od.order_id, od.product_id, p.name as product_name, od.quantity
        from orders as o 
        inner join users as u on o.user_id = u.id
        inner join order_details as od on o.id = od.order_id
        inner join products as p on od.product_id = p.id
        where o.user_id = ($1) and o.status = 'active'
      `;
      const result = await conn.query(sql, [user_id]);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`show current order error. ${error}`);
    }
  };

  async create(order: Order): Promise<Order> {
    const conn = await Client.connect();
    try {
      const sql = `insert into orders (user_id, status) values($1, $2) RETURNING *`;
      const result = await conn.query(sql, [order.user_id, order.status]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Create order error. ${error}`);
    }
  };
};
