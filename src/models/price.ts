import { DatabaseTable } from '../database/entitites/database';

export interface Price extends DatabaseTable {
  date: Date;
  price: number;

  // database
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

export default Price;
