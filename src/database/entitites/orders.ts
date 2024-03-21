import { Order } from '../../models';
import { Entity, SchemaMapping } from '../../models/database';
import knex from '..';
import Itens from './itens';
import Payments from './payments';
import Users from './users';

const orderColumns: SchemaMapping<Order> = {
  id: 'id',
  uuid: 'uuid',
  notes: 'notes',
  status: 'status',
  type: 'type',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const orderMapping: SchemaMapping<Order> = {
  id: 'id',
  uuid: 'uuid',
  notes: 'notes',
  status: 'status',
  type: 'type',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const schemaName = 'Order';
const tabName = 'Orders';

const selectColumnsListProducts = [
  knex.ref(orderMapping.notes).as(orderColumns.notes).withSchema(tabName),
  knex.ref(orderMapping.status).as(orderColumns.status).withSchema(tabName),
  knex.ref(orderMapping.type).as(orderColumns.type).withSchema(tabName),
  knex.ref(orderMapping.createdAt).as(orderColumns.createdAt).withSchema(tabName),
  knex.ref(orderMapping.updatedAt).as(orderColumns.updatedAt).withSchema(tabName),
];

const Orders: Entity<Order> = {
  name: schemaName,
  tableName: tabName,
  column: orderColumns,
  mapping: orderMapping,
  selectColumsRef: selectColumnsListProducts,
  reference: [Users, Itens, Payments],
  allowed: [orderColumns.status, orderColumns.type],
};

export default Orders;
