import { User } from '../../models';
import knex from '..';
import { Entity, ForeignKey, SchemaMapping } from './entity';

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
  type: 'type',
  status: 'status',
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
  type: 'type',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const schemaName = 'Salt';
const tabName = 'Users';

export const selectColumnsUsers = [
  knex.ref(userColumns.id).as(userMaping.id).withSchema(tabName),
  knex.ref(userColumns.uuid).as(userMaping.uuid).withSchema(tabName),
  knex.ref(userColumns.first_name).as(userMaping.first_name).withSchema(tabName),
  knex.ref(userColumns.last_name).as(userMaping.last_name).withSchema(tabName),
  knex.ref(userColumns.user_name).as(userMaping.user_name).withSchema(tabName),
  knex.ref(userColumns.password).as(userMaping.password).withSchema(tabName),
  knex.ref(userColumns.birthday).as(userMaping.birthday).withSchema(tabName),
  knex.ref(userColumns.email).as(userMaping.email).withSchema(tabName),
  knex.ref(userColumns.contact).as(userMaping.contact).withSchema(tabName),
  knex.ref(userColumns.type).as(userMaping.type).withSchema(tabName),
  knex.ref(userColumns.status).as(userMaping.status).withSchema(tabName),
  knex.ref(userColumns.createdAt).as(userMaping.createdAt).withSchema(tabName),
  knex.ref(userColumns.updatedAt).as(userMaping.updatedAt).withSchema(tabName),
];

export const Users: Entity<User> = {
  name: schemaName,
  tableName: tabName,
  column: userColumns,
  mapping: userMaping,
  selectColumsRef: selectColumnsUsers,
  allowed: [
    userMaping.first_name,
    userMaping.last_name,
    userMaping.user_name,
    userMaping.birthday,
    userMaping.email,
    userMaping.contact,
    userMaping.status,
    userMaping.type,
  ],
};

const userForeignKeys: ForeignKey[] = [
  {
    attribute: 'supervisor',
    references: Users.column.uuid,
    table: Users.tableName,
  },
];

Users.foreignKeys = userForeignKeys;

export default Users;
