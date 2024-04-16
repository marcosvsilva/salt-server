import { Payment } from '../../models';
import knex from '..';
import { Entity, ForeignKey, SchemaMapping } from './entity';
import { Orders } from './orders';

const paymentColumns: SchemaMapping<Payment> = {
  id: 'id',
  uuid: 'uuid',
  value: 'value',
  method: 'method',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const paymentMapping: SchemaMapping<Payment> = {
  id: 'id',
  uuid: 'uuid',
  value: 'value',
  method: 'method',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const schemaName = 'Salt';
const tabName = 'Payments';

const selectColumnsListProducts = [
  knex.ref(paymentColumns.value).as(paymentMapping.value).withSchema(tabName),
  knex.ref(paymentColumns.method).as(paymentMapping.method).withSchema(tabName),
  knex.ref(paymentColumns.status).as(paymentMapping.status).withSchema(tabName),
  knex.ref(paymentColumns.createdAt).as(paymentMapping.createdAt).withSchema(tabName),
  knex.ref(paymentColumns.updatedAt).as(paymentMapping.updatedAt).withSchema(tabName),
];

export const Payments: Entity<Payment> = {
  name: schemaName,
  tableName: tabName,
  column: paymentColumns,
  mapping: paymentMapping,
  selectColumsRef: selectColumnsListProducts,
  allowed: [paymentMapping.method, paymentMapping.status],
};

const paymentForeignKeys: ForeignKey[] = [
  {
    attribute: 'order',
    references: Orders.column.uuid,
    table: Orders.tableName,
  },
];

Payments.foreignKeys = paymentForeignKeys;

export default Payments;
