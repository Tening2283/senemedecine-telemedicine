import knex from 'knex';
import path from 'path';

// Import knexfile configuration
const knexfile = require(path.join(process.cwd(), 'knexfile'));

const environment = process.env.NODE_ENV || 'development';
const dbConfig = knexfile[environment];

export const db = knex(dbConfig);

export default db; 