import { Knex } from 'knex';

import { formatReferenceFieldUUId } from '../../helpers';
import Prices from '../entitites/prices';
import Products from '../entitites/products';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .hasTable(Prices.tableName)
    .then((exists) => {
      if (exists) {
        throw new Error(`Table ${Prices.tableName} already exists`);
      }

      return knex.schema.createTable(Prices.tableName, (table) => {
        // Identity
        table.increments(Prices.mapping.id).primary();
        table.uuid(Prices.mapping.uuid).unique().notNullable();

        // References
        table
          .uuid(formatReferenceFieldUUId(Products))
          .unsigned()
          .references(Products.mapping.uuid)
          .inTable(Products.tableName)
          .notNullable();

        // Colums
        table.datetime(Prices.mapping.date).notNullable();
        table.double(Prices.mapping.price).notNullable();

        // Controls
        table.dateTime(Prices.mapping.createdAt).notNullable().defaultTo(knex.fn.now());
        table.dateTime(Prices.mapping.updatedAt).notNullable().defaultTo(knex.fn.now());
      });
    })
    .catch((error) => console.error(error));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(Prices.tableName);
}
