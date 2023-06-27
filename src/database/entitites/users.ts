import knex from '..';
import { User } from '../models';
import { Entity, SchemaMapping } from './database';

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

const schemaName = 'User';
const tabName = 'Users';

export const selectColumnsUsers = [
  knex.ref(userMaping.uuid).as(userColumns.uuid).withSchema(tabName),
  knex.ref(userMaping.name).as(userColumns.name).withSchema(tabName),
  knex.ref(userMaping.user_name).as(userColumns.user_name).withSchema(tabName),
  knex.ref(userMaping.password).as(userColumns.password).withSchema(tabName),
  knex.ref(userMaping.createdAt).as(userColumns.createdAt).withSchema(tabName),
  knex.ref(userMaping.updatedAt).as(userColumns.updatedAt).withSchema(tabName),
];

const Users: Entity<User> = {
  name: schemaName,
  tableName: tabName,
  column: userColumns,
  mapping: userMaping,
  selectColumsRef: selectColumnsUsers,
  allowed: [userColumns.name, userColumns.user_name, userColumns.password],
};

export default Users;
