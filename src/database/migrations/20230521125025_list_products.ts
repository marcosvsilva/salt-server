import { Knex } from 'knex';

import { formatReferenceFieldUUId } from '../../utils';
import ListProducts from '../entitites/list_products';
import Lists from '../entitites/lists';
import Products from '../entitites/products';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .hasTable(ListProducts.tableName)
    .then((exists) => {
      if (exists) {
        throw new Error(`Table ${ListProducts.tableName} already exists`);
      }

      return knex.schema.createTable(ListProducts.tableName, (table) => {
        // Identity
        table.increments(ListProducts.mapping.id).primary();
        table.uuid(ListProducts.mapping.uuid).unique().notNullable();

        // References
        table
          .uuid(formatReferenceFieldUUId(Products))
          .unsigned()
          .references(Products.mapping.uuid)
          .inTable(Products.tableName)
          .notNullable();

        table
          .uuid(formatReferenceFieldUUId(Lists))
          .unsigned()
          .references(Lists.mapping.uuid)
          .inTable(Lists.tableName)
          .notNullable();

        // Colums
        table.integer(ListProducts.mapping.status).notNullable();
        table.datetime(ListProducts.mapping.date);

        // Controls
        table.dateTime(ListProducts.mapping.createdAt).notNullable().defaultTo(knex.fn.now());
        table.dateTime(ListProducts.mapping.updatedAt).notNullable().defaultTo(knex.fn.now());
      });
    })
    .catch((error) => console.error(error));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(ListProducts.tableName);
}
