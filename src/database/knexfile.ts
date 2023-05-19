import { Knex } from 'knex';

const options = {
    development: {
        client: 'pg',
        connection: {
            host: process.env.DB_HOST || '',
            user: process.env.DB_USER || '',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || '',
            port: Number(process.env.DB_PORT),
        },
        migrations: {
            tableName: process.env.DB_MIGRATIONS_TABLE || 'migrations',
            directory: __dirname + '/database/migrations',
            loadExtensions: ['.js'],
            extension: 'js',
        },
        useNullAsDefault: true,
    } as Knex.Config,

    production: {
    client: 'pg',
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
        directory: __dirname + '/database/migrations',
        loadExtensions: ['.js'],
        extension: 'js',
    },
    useNullAsDefault: true,
    } as Knex.Config,
};

const environment = process.env.NODE_ENV || 'development';
const config = options[environment];

export default config;
