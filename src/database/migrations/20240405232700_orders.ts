import { Knex } from 'knex';

import { ForeignKey } from '../entitites/entity';
import Orders from '../entitites/orders';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .hasTable(Orders.tableName)
    .then((exists) => {
      if (exists) {
        throw new Error(`Table ${Orders.tableName} already exists`);
      }

      return knex.schema.createTable(Orders.tableName, (table) => {
        // Identity
        table.increments(Orders.column.id).primary();
        table.uuid(Orders.column.uuid).unique().notNullable();

        // References
        if (Orders.foreignKeys) {
          Orders.foreignKeys.forEach((foreignKey: ForeignKey) => {
            table.uuid(foreignKey.uuid).references(foreignKey.references).inTable(foreignKey.table);
          });
        }

        // Colums
        table.double(Orders.column.discount).notNullable();
        table.double(Orders.column.totalPrice).notNullable();
        table.integer(Orders.column.type).notNullable();
        table.integer(Orders.column.status).notNullable();
        table.string(Orders.column.notes);

        // Controls
        table.dateTime(Orders.column.createdAt).notNullable().defaultTo(knex.fn.now());
        table.dateTime(Orders.column.updatedAt).notNullable().defaultTo(knex.fn.now());
      });
    })
    .catch((error) => console.error(error));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(Orders.tableName);
}
