import { Order } from '../../models';
import knex from '..';
import { Entity, ForeignKey, SchemaMapping } from './entity';
import Users from './users';

const orderColumns: SchemaMapping<Order> = {
  id: 'id',
  uuid: 'uuid',
  discount: 'discount',
  totalPrice: 'totalPrice',
  type: 'type',
  status: 'status',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const orderMapping: SchemaMapping<Order> = {
  id: 'id',
  uuid: 'uuid',
  discount: 'discount',
  totalPrice: 'totalPrice',
  type: 'type',
  status: 'status',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const schemaName = 'Salt';
const tabName = 'Orders';

const selectColumnsListProducts = [
  knex.ref(orderColumns.id).as(orderMapping.id).withSchema(tabName),
  knex.ref(orderColumns.uuid).as(orderMapping.uuid).withSchema(tabName),
  knex.ref(orderColumns.discount).as(orderMapping.discount).withSchema(tabName),
  knex.ref(orderColumns.totalPrice).as(orderMapping.totalPrice).withSchema(tabName),
  knex.ref(orderColumns.type).as(orderMapping.type).withSchema(tabName),
  knex.ref(orderColumns.status).as(orderMapping.status).withSchema(tabName),
  knex.ref(orderColumns.notes).as(orderMapping.notes).withSchema(tabName),
  knex.ref(orderColumns.createdAt).as(orderMapping.createdAt).withSchema(tabName),
  knex.ref(orderColumns.updatedAt).as(orderMapping.updatedAt).withSchema(tabName),
];

const Orders: Entity<Order> = {
  name: schemaName,
  tableName: tabName,
  column: orderColumns,
  mapping: orderMapping,
  selectColumsRef: selectColumnsListProducts,
  allowed: [orderMapping.status, orderMapping.type],
};

const orderForeignKeys: ForeignKey[] = [
  {
    uuid: 'user',
    references: Users.column.uuid,
    table: Users.tableName,
  },
];

Orders.foreignKeys = orderForeignKeys;

export default Orders;
