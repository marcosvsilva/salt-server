import { DatabaseTable } from './database';

export interface Price extends DatabaseTable {
  price: number;
  dateStart: Date;
  dateEnd: Date;

  // database
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

export default Price;
