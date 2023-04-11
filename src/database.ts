require('./utils/env');
import { Pool } from 'pg';

const { 
  POSTGRES_HOST, 
  POSTGRES_DB_DEV, 
  POSTGRES_DB_TEST, 
  POSTGRES_USER, 
  POSTGRES_PASSWORD, 
  POSTGRES_PORT,
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
    port: parseInt(POSTGRES_PORT || '5432'),
  });
} else {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB_DEV,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: parseInt(POSTGRES_PORT || '5432'),
  });
}

export default client;
