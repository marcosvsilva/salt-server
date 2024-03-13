import { Knex } from 'knex';

import Products from '../entitites/products';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .hasTable(Products.tableName)
    .then((exists) => {
      if (exists) {
        throw new Error(`Table ${Products.tableName} already exists`);
      }

      return knex.schema.createTable(Products.tableName, (table) => {
        // Identity
        table.increments(Products.mapping.id).primary();
        table.uuid(Products.mapping.uuid).unique().notNullable();

        // Colums
        table.string(Products.mapping.name).notNullable();
        table.string(Products.mapping.description);

        // Controls
        table.dateTime(Products.mapping.createdAt).notNullable().defaultTo(knex.fn.now());
        table.dateTime(Products.mapping.updatedAt).notNullable().defaultTo(knex.fn.now());
      });
    })
    .catch((error) => console.error(error));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(Products.tableName);
}
