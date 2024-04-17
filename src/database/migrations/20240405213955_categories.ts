import { Knex } from 'knex';

import { Categories, ForeignKey } from '../entitites';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .hasTable(Categories.tableName)
    .then((exists) => {
      if (exists) {
        throw new Error(`Table ${Categories.tableName} already exists`);
      }

      return knex.schema.createTable(Categories.tableName, (table) => {
        // Identity
        table.increments(Categories.column.id).primary();
        table.uuid(Categories.column.uuid).unique().notNullable();

        // References
        if (Categories.foreignKeys) {
          Categories.foreignKeys.forEach((foreignKey: ForeignKey) => {
            table
              .uuid(foreignKey.attribute)
              .references(foreignKey.references)
              .inTable(foreignKey.table);
          });
        }

        // Colums
        table.string(Categories.column.name).notNullable();
        table.string(Categories.column.description);
        table.integer(Categories.column.status).notNullable();

        // Controls
        table.dateTime(Categories.column.createdAt).notNullable().defaultTo(knex.fn.now());
        table.dateTime(Categories.column.updatedAt).notNullable().defaultTo(knex.fn.now());
      });
    })
    .catch((error) => console.error(error));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(Categories.tableName);
}
