import { InterfaceModel } from './model';
import { Status } from './types';

export interface Brand extends InterfaceModel {
  name: string;
  description: string;
  status: Status;

  // database
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

export default Brand;
