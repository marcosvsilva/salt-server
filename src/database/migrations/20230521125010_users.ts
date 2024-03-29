import { Knex } from 'knex';

import Users from '../entitites/users';

export async function up(knex: Knex): Promise<void> {
  // const jsonType = knex.client.config.client in ['sqlite3', 'oracledb'] ? 'json' : 'jsonb';

  return knex.schema
    .hasTable(Users.tableName)
    .then((exists) => {
      if (exists) {
        throw new Error(`Table ${Users.tableName} already exists`);
      }

      return knex.schema.createTable(Users.tableName, (table) => {
        // Identity
        table.increments(Users.mapping.id).primary();
        table.uuid(Users.mapping.uuid).unique().notNullable();

        // Colums
        table.string(Users.mapping.first_name).notNullable();
        table.string(Users.mapping.last_name).notNullable();
        table.string(Users.mapping.user_name).notNullable();
        table.string(Users.mapping.password).notNullable();
        table.dateTime(Users.mapping.birthday);
        table.string(Users.mapping.email).notNullable();
        table.string(Users.mapping.contact);

        // Controls
        table.dateTime(Users.mapping.createdAt).notNullable().defaultTo(knex.fn.now());
        table.dateTime(Users.mapping.updatedAt).notNullable().defaultTo(knex.fn.now());
      });
    })
    .catch((error) => console.error(error));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(Users.tableName);
}
