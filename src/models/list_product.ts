import { DatabaseTable } from './database';

export enum StatusListProduct {
  Create = 0,
  InQueue = 1,
  Bought = 2,
}

export interface ListProduct extends DatabaseTable {
  date: Date;
  status: StatusListProduct;

  // database
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

export default ListProduct;
