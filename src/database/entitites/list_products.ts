import { ListProduct } from '../../models';
import { Entity, SchemaMapping } from '../../models/database';
import knex from '..';
import Lists from './lists';
import Products from './products';

const listProductColumns: SchemaMapping<ListProduct> = {
  id: 'id',
  uuid: 'uuid',
  date: 'date',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const listProductMapping: SchemaMapping<ListProduct> = {
  id: 'id',
  uuid: 'uuid',
  date: 'date',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const schemaName = 'ListProduct';
const tabName = 'ListProducts';

const selectColumnsListProducts = [
  knex.ref(listProductMapping.uuid).as(listProductColumns.uuid).withSchema(tabName),
  knex.ref(listProductMapping.date).as(listProductColumns.date).withSchema(tabName),
  knex.ref(listProductMapping.status).as(listProductColumns.status).withSchema(tabName),
  knex.ref(listProductMapping.createdAt).as(listProductColumns.createdAt).withSchema(tabName),
  knex.ref(listProductMapping.updatedAt).as(listProductColumns.updatedAt).withSchema(tabName),
];

const ListProducts: Entity<ListProduct> = {
  name: schemaName,
  tableName: tabName,
  column: listProductColumns,
  mapping: listProductMapping,
  selectColumsRef: selectColumnsListProducts,
  reference: [Products, Lists],
  allowed: [listProductColumns.date, listProductColumns.status],
};

export default ListProducts;
