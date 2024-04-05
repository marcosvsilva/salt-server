import { InterfaceModel } from './model';
import { Status } from './types';

export interface Category extends InterfaceModel {
  name: string;
  description: string;
  status: Status;

  // database
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;

  // references
  father?: Category;
}

export default Category;
