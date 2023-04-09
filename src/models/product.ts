import Client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
}

export class ProductStore {
  async index(): Promise<Product[]> {
    const conn = await Client.connect();
    try {
      const sql = 'select * from products';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      conn.release();
      throw new Error(`product index error. ${error}`);
    }
  };

  async show(id: number): Promise<Product> {
    const conn = await Client.connect();
    try {
      const sql = 'select * from products where id = ($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`show product id: ${id}. ${error}`);
    }
  };

  async create(product: Product): Promise<Product> {
    const conn = await Client.connect();
    try {
      const sql = `insert into products (name, price) values($1, $2) RETURNING *`;
      const result = await conn.query(sql, [product.name, product.price]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Create product with value(${product.name}, ${product.price}) error. ${error}`);
    }
  };

  async delete(id: number): Promise<Product> {
    const conn = await Client.connect();
    try {
      const sql = `delete from products where id = ($1) RETURNING *`;
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Delete product with id: ${id}. ${error}`);
    }
  };
}
