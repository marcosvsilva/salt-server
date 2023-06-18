import knex from '..';
import { DatabaseTable, Entity, SchemaMapping } from './database';

export interface User extends DatabaseTable {
  name: string;
  user_name: string;
  password: string;

  // database
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

const userColumns: SchemaMapping<User> = {
  id: 'id',
  uuid: 'uuid',
  name: 'name',
  user_name: 'user_name',
  password: 'password',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const userMaping: SchemaMapping<User> = {
  id: 'id',
  uuid: 'uuid',
  name: 'name',
  user_name: 'user_name',
  password: 'password',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const Users: Entity<User> = {
  name: 'User',
  table_name: 'Users',
  column: userColumns,
  mapping: userMaping,
  allowed: [userColumns.name, userColumns.user_name, userColumns.password],
};

export const selectColumnsUsers = [
  knex.ref(Users.mapping.uuid).as(Users.column.uuid),
  knex.ref(Users.mapping.name).as(Users.column.name),
  knex.ref(Users.mapping.user_name).as(Users.column.user_name),
  knex.ref(Users.mapping.password).as(Users.column.password),
  knex.ref(Users.mapping.createdAt).as(Users.column.createdAt),
  knex.ref(Users.mapping.updatedAt).as(Users.column.updatedAt),
];

export default Users;
