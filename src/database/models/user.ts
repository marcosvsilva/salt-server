import { DatabaseTable } from '../entitites/database';

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

export default User;
