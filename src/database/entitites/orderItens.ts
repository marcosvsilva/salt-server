import { InterfaceModel } from '../../models';
import knex from '..';
import { Entity, ForeignKey, SchemaMapping } from './entity';
import { Itens } from './itens';
import { Orders } from './orders';

const orderItensColumns: SchemaMapping<InterfaceModel> = {
  id: 'id',
  uuid: 'uuid',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const orderItensMapping: SchemaMapping<InterfaceModel> = {
  id: 'id',
  uuid: 'uuid',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const schemaName = 'salt';
const tabName = 'orders_itens';

const selectColumnsListProducts = [
  knex.ref(orderItensColumns.id).as(orderItensMapping.id).withSchema(tabName),
  knex.ref(orderItensColumns.uuid).as(orderItensMapping.uuid).withSchema(tabName),
  knex.ref(orderItensColumns.createdAt).as(orderItensMapping.createdAt).withSchema(tabName),
  knex.ref(orderItensColumns.updatedAt).as(orderItensMapping.updatedAt).withSchema(tabName),
];

export const OrderItens: Entity<InterfaceModel> = {
  name: schemaName,
  tableName: tabName,
  column: orderItensColumns,
  mapping: orderItensMapping,
  selectColumsRef: selectColumnsListProducts,
  allowed: [],
};

const categoryForeignKeys: ForeignKey[] = [
  {
    attribute: 'order',
    references: Orders.column.uuid,
    table: Orders.tableName,
  },
  {
    attribute: 'itens',
    references: Itens.column.uuid,
    table: Itens.tableName,
  },
];

OrderItens.foreignKeys = categoryForeignKeys;

export default OrderItens;
