import { Knex } from 'knex';

import { Brands, ForeignKey } from '../entitites';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .hasTable(Brands.tableName)
    .then((exists) => {
      if (exists) {
        throw new Error(`Table ${Brands.tableName} already exists`);
      }

      return knex.schema.createTable(Brands.tableName, (table) => {
        // Identity
        table.increments(Brands.column.id).primary();
        table.uuid(Brands.column.uuid).unique().notNullable();

        // References
        if (Brands.foreignKeys) {
          Brands.foreignKeys.forEach((foreignKey: ForeignKey) => {
            table
              .uuid(foreignKey.attribute)
              .references(foreignKey.references)
              .inTable(foreignKey.table);
          });
        }

        // Attributes
        table.string(Brands.column.name).notNullable();
        table.string(Brands.column.description);
        table.integer(Brands.column.status).notNullable();

        // Controls
        table.dateTime(Brands.column.createdAt).notNullable().defaultTo(knex.fn.now());
        table.dateTime(Brands.column.updatedAt).notNullable().defaultTo(knex.fn.now());
      });
    })
    .catch((error) => console.error(error));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(Brands.tableName);
}
