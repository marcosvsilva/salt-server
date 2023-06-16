import knex from '..';
import { DatabaseTable, Entity, SchemaMapping } from './database';
import Users from './users';

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

  //database
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
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

const Lists: Entity<List> = {
  name: 'List',
  table_name: 'Lists',
  column: listColumns,
  mapping: listMapping,
  reference: [Users],
  allowed: [
    listColumns.name,
    listColumns.status,
    listColumns.total_list,
    listColumns.discount,
    listColumns.date_completed,
  ],
};

export const selectColumnsLists = [
  knex.ref(Lists.mapping.uuid).as(Lists.column.uuid),
  knex.ref(Lists.mapping.name).as(Lists.column.name),
  knex.ref(Lists.mapping.status).as(Lists.column.status),
  knex.ref(Lists.mapping.total_list).as(Lists.column.total_list),
  knex.ref(Lists.mapping.discount).as(Lists.column.discount),
  knex.ref(Lists.mapping.date_completed).as(Lists.column.date_completed),
  knex.ref(Lists.mapping.createdAt).as(Lists.column.createdAt),
  knex.ref(Lists.mapping.updatedAt).as(Lists.column.updatedAt),
];

export default Lists;
