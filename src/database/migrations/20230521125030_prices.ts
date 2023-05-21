import { Knex } from 'knex';
import Prices from '../entitites/prices';
import Products from '../entitites/products';

export async function up(knex: Knex): Promise<void> {
  const jsonType = knex.client.config.client in ['sqlite3', 'oracledb'] ? 'json' : 'jsonb';

  return knex.schema
    .hasTable(Prices.table_name)
    .then((exists) => {
      if (exists) {
        throw new Error(`Table ${Prices.table_name} already exists`);
      }

      return knex.schema.createTable(Prices.table_name, (table) => {
        // Identity
        table.increments(Prices.mapping.id).primary();
        table.uuid(Prices.mapping.uuid).unique().notNullable();

        // References
        table.integer(`${Products.table_name}_${Products.mapping.id}`)
            .unsigned()
            .references(Products.mapping.id)
            .inTable(Products.table_name);

        table.uuid(`${Products.table_name}_${Products.mapping.uuid}`)
            .unsigned()
            .references(Products.mapping.uuid)
            .inTable(Products.table_name);

        // Colums
        table.datetime(Prices.mapping.date).notNullable;
        table.double(Prices.mapping.price).notNullable;

        // Controls
        table.dateTime(Prices.mapping.createdAt).notNullable().defaultTo(knex.fn.now());
        table.dateTime(Prices.mapping.updatedAt).notNullable().defaultTo(knex.fn.now());
        });
    })
    .catch((error) => console.error(error));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(Prices.table_name);
}
