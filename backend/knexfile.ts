import { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const migrationsDir = path.join(__dirname, 'src', 'database', 'migrations');
const seedsDir = path.join(__dirname, 'src', 'database', 'seeds');

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'senemedecine',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'azerty',
      ssl: false,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: migrationsDir
    },
    seeds: {
      directory: seedsDir
    }
  },

  test: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME_TEST || 'senemedecine_test',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'azerty',
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: migrationsDir
    },
    seeds: {
      directory: seedsDir
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: false
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: migrationsDir
    },
    seeds: {
      directory: seedsDir
    }
  }
};

export default config; 