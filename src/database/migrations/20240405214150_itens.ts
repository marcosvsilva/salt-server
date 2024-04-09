import { Knex } from 'knex';

import { ForeignKey } from '../entitites/entity';
import Itens from '../entitites/itens';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .hasTable(Itens.tableName)
    .then((exists) => {
      if (exists) {
        throw new Error(`Table ${Itens.tableName} already exists`);
      }

      return knex.schema.createTable(Itens.tableName, (table) => {
        // Identity
        table.increments(Itens.column.id).primary();
        table.uuid(Itens.column.uuid).unique().notNullable();

        // References
        if (Itens.foreignKeys) {
          Itens.foreignKeys.forEach((foreignKey: ForeignKey) => {
            table.uuid(foreignKey.uuid).references(foreignKey.references).inTable(foreignKey.table);
          });
        }

        // Colums
        table.string(Itens.column.description).notNullable();
        table.integer(Itens.column.status).notNullable();

        // Controls
        table.dateTime(Itens.column.createdAt).notNullable().defaultTo(knex.fn.now());
        table.dateTime(Itens.column.updatedAt).notNullable().defaultTo(knex.fn.now());
      });
    })
    .catch((error) => console.error(error));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(Itens.tableName);
}
