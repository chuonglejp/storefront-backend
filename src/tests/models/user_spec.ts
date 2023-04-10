import assert from 'assert';
import Client from '../../database';
import { User, UserStore } from '../../models/user';

const store = new UserStore();

describe('Test user model', () => {
  beforeAll(async () => {
    const conn = await Client.connect();
    await conn.query('truncate table users');
    conn.release();
  });

  let id = 0;

  it('create', async () => {
    const data = {
      username: 'chuongle',
      first_name: 'chuong',
      last_name: 'le',
      password: 'test',
    };
    const user = await store.create(data);
    expect(user.username).toBe(data.username);
    expect(user.first_name).toBe(data.first_name);
    expect(user.last_name).toBe(data.last_name);
    id = user.id || 0;
  });

  it('index', async () => {
    const users = await store.index();
    expect(users.length).toBe(1);
  });

  it('show', async () => {
    const user = await store.show(id);
    expect(user.id).toBe(id);
    expect(user.username).toBe('chuongle');
  });

  it('authenticate', async () => {
    const auth = await store.authenticate('chuongle', 'test');
    if (!auth) {
      assert(false);
    }
    expect(auth).toBe(true);
  });
});