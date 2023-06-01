import { Knex } from 'knex';
import { formatReferenceFieldId, formatReferenceFieldUUId } from '../../utils';
import ListProducts from '../entitites/list_products';
import Products from '../entitites/products';
import Lists from '../entitites/lists';

export async function up(knex: Knex): Promise<void> {
  const jsonType = knex.client.config.client in ['sqlite3', 'oracledb'] ? 'json' : 'jsonb';

  return knex.schema
    .hasTable(ListProducts.table_name)
    .then((exists) => {
      if (exists) {
        throw new Error(`Table ${ListProducts.table_name} already exists`);
      }

      return knex.schema.createTable(ListProducts.table_name, (table) => {
        // Identity
        table.increments(ListProducts.mapping.id).primary();
        table.uuid(ListProducts.mapping.uuid).unique().notNullable();

        // References
        table
          .integer(formatReferenceFieldId(Products))
          .unsigned()
          .references(Products.mapping.id)
          .inTable(Products.table_name)
          .notNullable();

        table
          .uuid(formatReferenceFieldUUId(Products))
          .unsigned()
          .references(Products.mapping.uuid)
          .inTable(Products.table_name)
          .notNullable();

        table
          .integer(formatReferenceFieldId(Lists))
          .unsigned()
          .references(Lists.mapping.id)
          .inTable(Lists.table_name)
          .notNullable();

        table
          .uuid(formatReferenceFieldUUId(Lists))
          .unsigned()
          .references(Lists.mapping.uuid)
          .inTable(Lists.table_name)
          .notNullable();

        // Colums
        table.integer(ListProducts.mapping.status).notNullable;
        table.datetime(ListProducts.mapping.date);

        // Controls
        table.dateTime(ListProducts.mapping.createdAt).notNullable().defaultTo(knex.fn.now());
        table.dateTime(ListProducts.mapping.updatedAt).notNullable().defaultTo(knex.fn.now());
      });
    })
    .catch((error) => console.error(error));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(ListProducts.table_name);
}
