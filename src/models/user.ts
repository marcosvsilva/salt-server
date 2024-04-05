import { InterfaceModel } from './model';
import { Status } from './types';

export enum TypeUser {
  Visitor = 0,
  User = 1,
  Staff = 2,
  Supervisor = 3,
  Manager = 4,
}

export interface User extends InterfaceModel {
  first_name: string;
  last_name: string;
  user_name: string;
  password: string;
  birthday: Date;
  email: string;
  contact: string;
  status: Status;
  type: TypeUser;

  // base
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;

  // references
  super?: User;
}

export default User;
