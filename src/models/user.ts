require('../utils/env');
import Client from '../database';
import bcrypt from 'bcrypt';

const { 
  BCRYPT_PASSWORD,
  SALT_ROUNDS
} =  process.env;

export type User = {
  id?: number;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    const conn = await Client.connect();
    try {
      const sql = 'select id, username, first_name, last_name from users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`get users error. ${error}`);
    }
  };

  async show(id: number): Promise<User> {
    const conn = await Client.connect();
    try {
      const sql = 'select * from users where id = ($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`get user error. ${error}`);
    }
  };

  async create(u: User): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = 'INSERT INTO users (username, first_name, last_name, password) VALUES($1, $2, $3, $4) RETURNING *';

      const hash = bcrypt.hashSync(
        u.password + BCRYPT_PASSWORD, 
        parseInt(SALT_ROUNDS as string)
      );

      const result = await conn.query(sql, [u.username, u.first_name, u.last_name, hash]);
      const user = result.rows[0];

      conn.release();

      return user;
    } catch (error) {
      throw new Error(`Create user error. ${error}`);
    }
  };

  async authenticate(username: string, password: string): Promise<boolean> {
    const conn = await Client.connect();
    const sql = 'SELECT password FROM users WHERE username=($1)';
    const result = await conn.query(sql, [username]);
    if(result.rows.length) {
      const user = result.rows[0];
      if (bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password)) {
        return true;
      }
    }
    return false;
  };

  async getByUsername(username: string): Promise<User> {
    const conn = await Client.connect();
    try {
      const sql = 'select * from users where username = ($1)';
      const result = await conn.query(sql, [username]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`get user by username error. ${error}`);
    }
  };
};