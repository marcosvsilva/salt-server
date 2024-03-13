import { DatabaseTable } from '../database/entitites/database';
import { Price } from './price';

export interface Product extends DatabaseTable {
  name: string;
  description: string;

  // database
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;

  // references
  prices?: Price[];
}

export default Product;
