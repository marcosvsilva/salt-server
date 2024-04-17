import { Knex } from 'knex';

import { ForeignKey, Prices } from '../entitites';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .hasTable(Prices.tableName)
    .then((exists) => {
      if (exists) {
        throw new Error(`Table ${Prices.tableName} already exists`);
      }

      return knex.schema.createTable(Prices.tableName, (table) => {
        // Identity
        table.increments(Prices.column.id).primary();
        table.uuid(Prices.column.uuid).unique().notNullable();

        // References
        if (Prices.foreignKeys) {
          Prices.foreignKeys.forEach((foreignKey: ForeignKey) => {
            table
              .uuid(foreignKey.attribute)
              .references(foreignKey.references)
              .inTable(foreignKey.table);
          });
        }

        // Colums
        table.double(Prices.column.price).notNullable();
        table.dateTime(Prices.column.dateStart).notNullable().defaultTo(knex.fn.now());
        table.dateTime(Prices.column.dateEnd);

        // Controls
        table.dateTime(Prices.column.createdAt).notNullable().defaultTo(knex.fn.now());
        table.dateTime(Prices.column.updatedAt).notNullable().defaultTo(knex.fn.now());
      });
    })
    .catch((error) => console.error(error));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(Prices.tableName);
}
