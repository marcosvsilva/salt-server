import { DatabaseTable } from './database';

export enum StatusUser {
  Active = 0,
  Inactive = 1,
  Removed = 2,
}

export enum TypeUser {
  User = 0,
  Staff = 1,
  Supervisor = 2,
  Manager = 3,
}

export interface User extends DatabaseTable {
  first_name: string;
  last_name: string;
  user_name: string;
  password: string;
  birthday: Date;
  email: string;
  contact: string;
  status: StatusUser;
  type: TypeUser;

  // database
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

export default User;
