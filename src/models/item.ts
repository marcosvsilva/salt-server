import { Category } from './category';
import { DatabaseTable } from './database';
import { Price } from './price';

export enum StatusItem {
  Active = 0,
  SoldOut = 1,
  Sale = 2,
  Inactive = 3,
}

export interface Item extends DatabaseTable {
  description: string;
  brand: string;
  status: StatusItem;

  // database
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;

  // references
  prices?: Price[];
  category?: Category;
}

export default Item;
