import { Knex } from 'knex';
import Users from '../entitites/users';

export async function up(knex: Knex): Promise<void> {
  const jsonType = knex.client.config.client in ['sqlite3', 'oracledb'] ? 'json' : 'jsonb';

  return knex.schema
    .hasTable(Users.table_name)
    .then((exists) => {
      if (exists) {
        throw new Error(`Table ${Users.table_name} already exists`);
      }

      return knex.schema.createTable(Users.table_name, (table) => {
        // Identity
        table.increments(Users.mapping.id).primary();
        table.uuid(Users.mapping.uuid).unique().notNullable();

        // Colums
        table.string(Users.mapping.name).notNullable;
        table.string(Users.mapping.user_name).notNullable;
        table.string(Users.mapping.password).notNullable;

        // Controls
        table.dateTime(Users.mapping.createdAt).notNullable().defaultTo(knex.fn.now());
        table.dateTime(Users.mapping.updatedAt).notNullable().defaultTo(knex.fn.now());
        });
    })
    .catch((error) => console.error(error));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(Users.table_name);
}
