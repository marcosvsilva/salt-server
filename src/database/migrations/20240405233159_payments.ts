import { Knex } from 'knex';

import { ForeignKey, Payments } from '../entitites';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .hasTable(Payments.tableName)
    .then((exists) => {
      if (exists) {
        throw new Error(`Table ${Payments.tableName} already exists`);
      }

      return knex.schema.createTable(Payments.tableName, (table) => {
        // Identity
        table.increments(Payments.column.id).primary();
        table.uuid(Payments.column.uuid).unique().notNullable();

        // References
        if (Payments.foreignKeys) {
          Payments.foreignKeys.forEach((foreignKey: ForeignKey) => {
            table
              .uuid(foreignKey.attribute)
              .references(foreignKey.references)
              .inTable(foreignKey.table);
          });
        }

        // Colums
        table.double(Payments.column.value).notNullable();
        table.integer(Payments.column.method).notNullable();
        table.integer(Payments.column.status).notNullable();

        // Controls
        table.dateTime(Payments.column.createdAt).notNullable().defaultTo(knex.fn.now());
        table.dateTime(Payments.column.updatedAt).notNullable().defaultTo(knex.fn.now());
      });
    })
    .catch((error) => console.error(error));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(Payments.tableName);
}
