import { Knex } from 'knex';

import { formatReferenceFieldUUId } from '../../utils';
import Lists from '../entitites/lists';
import Users from '../entitites/users';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .hasTable(Lists.tableName)
    .then((exists) => {
      if (exists) {
        throw new Error(`Table ${Lists.tableName} already exists`);
      }

      return knex.schema.createTable(Lists.tableName, (table) => {
        // Identity
        table.increments(Lists.mapping.id).primary();
        table.uuid(Lists.mapping.uuid).unique().notNullable();

        // References
        table
          .uuid(formatReferenceFieldUUId(Users))
          .unsigned()
          .references(Users.mapping.uuid)
          .inTable(Users.tableName)
          .notNullable();

        // Colums
        table.string(Lists.mapping.name);
        table.integer(Lists.mapping.status).notNullable();
        table.double(Lists.mapping.total_list).notNullable();
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
  return knex.schema.dropTableIfExists(Lists.tableName);
}
