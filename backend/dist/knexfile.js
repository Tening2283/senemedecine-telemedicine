"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const migrationsDir = path_1.default.join(__dirname, 'src', 'database', 'migrations');
const seedsDir = path_1.default.join(__dirname, 'src', 'database', 'seeds');
const config = {
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
exports.default = config;
//# sourceMappingURL=knexfile.js.map