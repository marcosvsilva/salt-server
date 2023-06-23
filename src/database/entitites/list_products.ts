import knex from '..';
import { DatabaseTable, Entity, SchemaMapping } from './database';
import Lists from './lists';
import Products from './products';

export enum StatusListProduct {
  Create = 0,
  InQueue = 1,
  Bought = 2,
}

export interface ListProduct extends DatabaseTable {
  date: Date;
  status: StatusListProduct;

  // database
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

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
