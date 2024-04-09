import { Knex } from 'knex';

import { ForeignKey } from '../entitites/entity';
import OrderItens from '../entitites/orderItem';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .hasTable(OrderItens.tableName)
    .then((exists) => {
      if (exists) {
        throw new Error(`Table ${OrderItens.tableName} already exists`);
      }

      return knex.schema.createTable(OrderItens.tableName, (table) => {
        // Identity
        table.increments(OrderItens.column.id).primary();
        table.uuid(OrderItens.column.uuid).unique().notNullable();

        // References
        if (OrderItens.foreignKeys) {
          OrderItens.foreignKeys.forEach((foreignKey: ForeignKey) => {
            table.uuid(foreignKey.uuid).references(foreignKey.references).inTable(foreignKey.table);
          });
        }

        // Controls
        table.dateTime(OrderItens.column.createdAt).notNullable().defaultTo(knex.fn.now());
        table.dateTime(OrderItens.column.updatedAt).notNullable().defaultTo(knex.fn.now());
      });
    })
    .catch((error) => console.error(error));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(OrderItens.tableName);
}
