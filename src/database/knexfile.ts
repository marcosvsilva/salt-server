import { Knex } from 'knex';

const options = {
  development: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST || '',
      user: process.env.DB_USER || '',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || '',
      port: Number(process.env.DB_PORT),
    },
    migrations: {
      tableName: process.env.DB_MIGRATIONS_TABLE || 'migrations',
      directory: `${__dirname}/migrations`,
      loadExtensions: ['.ts'],
      extension: 'ts',
    },
    useNullAsDefault: true,
  } as Knex.Config,

  production: {
    client: process.env.DB_CLIENT,
    acquireConnectionTimeout: 60000 * 3,
    connection: {
      host: process.env.DB_HOST || '',
      user: process.env.DB_USER || '',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || '',
      port: Number(process.env.DB_PORT),
    },
    migrations: {
      tableName: process.env.DB_MIGRATIONS_TABLE || 'migrations',
      directory: `${__dirname}/migrations`,
      loadExtensions: ['.ts'],
      extension: 'ts',
    },
    useNullAsDefault: true,
  } as Knex.Config,
};

const environment = process.env.NODE_ENV || 'development';
const config: Knex.Config = options[environment];

export default config;
