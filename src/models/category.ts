import { DatabaseTable } from './database';

export enum StatusItem {
  Active = 0,
  Inactive = 1,
}

export interface Category extends DatabaseTable {
  name: string;
  description: string;
  status: StatusItem;

  // database
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;

  // references
  father?: Category;
}

export default Category;
