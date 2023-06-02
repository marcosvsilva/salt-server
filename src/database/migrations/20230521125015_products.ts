import { Knex } from 'knex';
import Products from '../entitites/products';

export async function up(knex: Knex): Promise<void> {
  const jsonType = knex.client.config.client in ['sqlite3', 'oracledb'] ? 'json' : 'jsonb';

  return knex.schema
    .hasTable(Products.table_name)
    .then((exists) => {
      if (exists) {
        throw new Error(`Table ${Products.table_name} already exists`);
      }

      return knex.schema.createTable(Products.table_name, (table) => {
        // Identity
        table.increments(Products.mapping.id).primary();
        table.uuid(Products.mapping.uuid).unique().notNullable();

        // Colums
        table.string(Products.mapping.name).notNullable;
        table.string(Products.mapping.description);

        // Controls
        table.dateTime(Products.mapping.createdAt).notNullable().defaultTo(knex.fn.now());
        table.dateTime(Products.mapping.updatedAt).notNullable().defaultTo(knex.fn.now());
      });
    })
    .catch((error) => console.error(error));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(Products.table_name);
}
