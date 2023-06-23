import knex from '..';
import { DatabaseTable, Entity, SchemaMapping } from './database';
import { Product } from './products';
import Users, { User } from './users';

export enum StatusList {
  Create = 0,
  InProgress = 1,
  Complete = 2,
  Canceled = 3,
}

export interface List extends DatabaseTable {
  name: string;
  status: StatusList;
  total_list: number;
  discount: number;
  date_completed: Date;

  // database
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;

  // references
  user?: User;
  products?: Product[];
}

const listColumns: SchemaMapping<List> = {
  id: 'id',
  uuid: 'uuid',
  name: 'name',
  status: 'status',
  total_list: 'total_list',
  discount: 'discount',
  date_completed: 'date_completed',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const listMapping: SchemaMapping<List> = {
  id: 'id',
  uuid: 'uuid',
  name: 'name',
  status: 'status',
  total_list: 'total_list',
  discount: 'discount',
  date_completed: 'date_completed',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const schemaName = 'List';
const tabName = 'Lists';

const selectColumnsLists = [
  knex.ref(listMapping.uuid).as(listColumns.uuid).withSchema(tabName),
  knex.ref(listMapping.name).as(listColumns.name).withSchema(tabName),
  knex.ref(listMapping.status).as(listColumns.status).withSchema(tabName),
  knex.ref(listMapping.total_list).as(listColumns.total_list).withSchema(tabName),
  knex.ref(listMapping.discount).as(listColumns.discount).withSchema(tabName),
  knex.ref(listMapping.date_completed).as(listColumns.date_completed).withSchema(tabName),
  knex.ref(listMapping.createdAt).as(listColumns.createdAt).withSchema(tabName),
  knex.ref(listMapping.updatedAt).as(listColumns.updatedAt).withSchema(tabName),
];

const Lists: Entity<List> = {
  name: schemaName,
  tableName: tabName,
  column: listColumns,
  mapping: listMapping,
  selectColumsRef: selectColumnsLists,
  reference: [Users],
  allowed: [
    listColumns.name,
    listColumns.status,
    listColumns.total_list,
    listColumns.discount,
    listColumns.date_completed,
  ],
};

export default Lists;
