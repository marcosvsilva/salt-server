import { Brand } from './brand';
import { Category } from './category';
import { InterfaceModel } from './model';
import { Price } from './price';
import { Status } from './types';

export interface Item extends InterfaceModel {
  description: string;
  status: Status;

  // base
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;

  // references
  brand?: Brand;
  category?: Category;
  prices?: Price[];
}

export default Item;
