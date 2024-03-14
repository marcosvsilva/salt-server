import { DatabaseTable } from './database';
import { Product } from './product';
import { User } from './user';

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

  // database
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;

  // references
  user?: User;
  products?: Product[];
}
