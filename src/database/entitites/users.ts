import { User } from '../../models';
import { Entity, SchemaMapping } from '../../models/database';
import knex from '..';

const userColumns: SchemaMapping<User> = {
  id: 'id',
  uuid: 'uuid',
  first_name: 'first_name',
  last_name: 'last_name',
  user_name: 'user_name',
  password: 'password',
  birthday: 'birthday',
  email: 'email',
  contact: 'contact',
  status: 'status',
  type: 'type',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const userMaping: SchemaMapping<User> = {
  id: 'id',
  uuid: 'uuid',
  first_name: 'first_name',
  last_name: 'last_name',
  user_name: 'user_name',
  password: 'password',
  birthday: 'birthday',
  email: 'email',
  contact: 'contact',
  status: 'status',
  type: 'type',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const schemaName = 'User';
const tabName = 'Users';

export const selectColumnsUsers = [
  knex.ref(userMaping.uuid).as(userColumns.uuid).withSchema(tabName),
  knex.ref(userMaping.first_name).as(userColumns.first_name).withSchema(tabName),
  knex.ref(userMaping.last_name).as(userColumns.last_name).withSchema(tabName),
  knex.ref(userMaping.user_name).as(userColumns.user_name).withSchema(tabName),
  knex.ref(userMaping.password).as(userColumns.password).withSchema(tabName),
  knex.ref(userMaping.birthday).as(userColumns.birthday).withSchema(tabName),
  knex.ref(userMaping.email).as(userColumns.email).withSchema(tabName),
  knex.ref(userMaping.contact).as(userColumns.contact).withSchema(tabName),
  knex.ref(userMaping.status).as(userColumns.status).withSchema(tabName),
  knex.ref(userMaping.type).as(userColumns.type).withSchema(tabName),
  knex.ref(userMaping.createdAt).as(userColumns.createdAt).withSchema(tabName),
  knex.ref(userMaping.updatedAt).as(userColumns.updatedAt).withSchema(tabName),
];

const Users: Entity<User> = {
  name: schemaName,
  tableName: tabName,
  column: userColumns,
  mapping: userMaping,
  selectColumsRef: selectColumnsUsers,
  allowed: [
    userColumns.first_name,
    userColumns.last_name,
    userColumns.user_name,
    userColumns.birthday,
    userColumns.email,
    userColumns.contact,
    userColumns.status,
    userColumns.type,
  ],
};

export default Users;
