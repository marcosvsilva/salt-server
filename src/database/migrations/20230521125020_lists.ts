import { Knex } from 'knex';
import { formatReferenceFieldId, formatReferenceFieldUUId } from '../../utils';
import Lists from '../entitites/lists';
import Users from '../entitites/users';

export async function up(knex: Knex): Promise<void> {
  const jsonType = knex.client.config.client in ['sqlite3', 'oracledb'] ? 'json' : 'jsonb';

  return knex.schema
    .hasTable(Lists.table_name)
    .then((exists) => {
      if (exists) {
        throw new Error(`Table ${Lists.table_name} already exists`);
      }

      return knex.schema.createTable(Lists.table_name, (table) => {
        // Identity
        table.increments(Lists.mapping.id).primary();
        table.uuid(Lists.mapping.uuid).unique().notNullable();

        // References
        table
          .uuid(formatReferenceFieldUUId(Users))
          .unsigned()
          .references(Users.mapping.uuid)
          .inTable(Users.table_name)
          .notNullable();

        // Colums
        table.string(Lists.mapping.name);
        table.integer(Lists.mapping.status).notNullable;
        table.double(Lists.mapping.total_list).notNullable;
        table.double(Lists.mapping.discount);
        table.datetime(Lists.mapping.date_completed);

        // Controls
        table.dateTime(Lists.mapping.createdAt).notNullable().defaultTo(knex.fn.now());
        table.dateTime(Lists.mapping.updatedAt).notNullable().defaultTo(knex.fn.now());
      });
    })
    .catch((error) => console.error(error));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(Lists.table_name);
}
