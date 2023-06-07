import { DatabaseTable, Entity, SchemaMapping } from './database';

export interface User extends DatabaseTable {
  name: string;
  user_name: string;
  password: string;

  //database
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
  allowed: [userColumns.name,
            userColumns.user_name,
            userColumns.password],
};

export default Users;
