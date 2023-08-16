import { DatabaseTable } from '../entitites/database';

export interface User extends DatabaseTable {
  first_name: string;
  last_name: string;
  user_name: string;
  password: string;
  birthday: Date;
  email: string;
  contact: string;

  // database
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

export default User;
