import { Knex, knex as knexCli } from 'knex';

import knexfile from './knexfile';

/**
 * Knex
 */

const knex: Knex = knexCli(knexfile);

// Dummy query to check connection
let dummyQuery = 'SELECT 1+1 AS result';

if (knexfile.client === 'oracledb') {
  dummyQuery += ' FROM DUAL';
}

if (process.env.DB_CLIENT) {
  knex
    .raw(dummyQuery)
    .then(() => {
      console.log(`💾 [database] ✅: { client: ${knex.client.config.client} }`);
    })
    .catch((error) => {
      console.error(`💾 [database] 💥: ${error.message}`);
    });
}

export default knex;
