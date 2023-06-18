/* eslint-disable max-len */
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

const ListProducts: Entity<ListProduct> = {
  name: 'ListProduct',
  table_name: 'ListProducts',
  column: listProductColumns,
  mapping: listProductMapping,
  reference: [Products, Lists],
  allowed: [listProductColumns.date, listProductColumns.status],
};

export const selectColumnsListProducts = [
  knex
    .ref(ListProducts.mapping.uuid)
    .as(ListProducts.column.uuid)
    .withSchema(ListProducts.table_name),
  knex
    .ref(ListProducts.mapping.date)
    .as(ListProducts.column.date)
    .withSchema(ListProducts.table_name),
  knex
    .ref(ListProducts.mapping.status)
    .as(ListProducts.column.status)
    .withSchema(ListProducts.table_name),
  knex
    .ref(ListProducts.mapping.createdAt)
    .as(ListProducts.column.createdAt)
    .withSchema(ListProducts.table_name),
  knex
    .ref(ListProducts.mapping.updatedAt)
    .as(ListProducts.column.updatedAt)
    .withSchema(ListProducts.table_name),
];

export default ListProducts;
