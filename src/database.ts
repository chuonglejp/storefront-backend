require('./utils/env');
import { Pool } from 'pg';

const { 
  POSTGRES_HOST, 
  POSTGRES_DB_DEV, 
  POSTGRES_DB_TEST, 
  POSTGRES_USER, 
  POSTGRES_PASSWORD, 
  ENV 
} =  process.env;

console.log('ENV', ENV);

let client: Pool;

if (ENV === 'test') {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB_TEST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
} else {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB_DEV,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
}

export default client;
