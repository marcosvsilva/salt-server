import { Knex } from 'knex';

import { ForeignKey, Users } from '../entitites';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .hasTable(Users.tableName)
    .then((exists) => {
      if (exists) {
        throw new Error(`Table ${Users.tableName} already exists`);
      }

      return knex.schema.createTable(Users.tableName, (table) => {
        // Identity
        table.increments(Users.column.id).primary();
        table.uuid(Users.column.uuid).unique().notNullable();

        // References
        if (Users.foreignKeys) {
          Users.foreignKeys.forEach((foreignKey: ForeignKey) => {
            table
              .uuid(foreignKey.attribute)
              .references(foreignKey.references)
              .inTable(foreignKey.table);
          });
        }

        // Colums
        table.string(Users.column.first_name).notNullable();
        table.string(Users.column.last_name).notNullable();
        table.string(Users.column.user_name).notNullable();
        table.string(Users.column.password).notNullable();
        table.dateTime(Users.column.birthday);
        table.string(Users.column.email);
        table.string(Users.column.contact);
        table.integer(Users.column.type);
        table.integer(Users.column.status);

        // Controls
        table.dateTime(Users.column.createdAt).notNullable().defaultTo(knex.fn.now());
        table.dateTime(Users.column.updatedAt).notNullable().defaultTo(knex.fn.now());
      });
    })
    .catch((error) => console.error(error));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(Users.tableName);
}
