import { Payment } from '../../models';
import { Entity, SchemaMapping } from '../../models/database';
import knex from '..';
import Prices from './prices';

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

const schemaName = 'Payment';
const tabName = 'Payments';

const selectColumnsListProducts = [
  knex.ref(paymentMapping.value).as(paymentColumns.value).withSchema(tabName),
  knex.ref(paymentMapping.method).as(paymentColumns.method).withSchema(tabName),
  knex.ref(paymentMapping.status).as(paymentColumns.status).withSchema(tabName),
  knex.ref(paymentMapping.createdAt).as(paymentColumns.createdAt).withSchema(tabName),
  knex.ref(paymentMapping.updatedAt).as(paymentColumns.updatedAt).withSchema(tabName),
];

const Payments: Entity<Payment> = {
  name: schemaName,
  tableName: tabName,
  column: paymentColumns,
  mapping: paymentMapping,
  selectColumsRef: selectColumnsListProducts,
  allowed: [paymentColumns.method, paymentColumns.status],
};

export default Payments;
