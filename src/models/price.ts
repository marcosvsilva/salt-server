import { InterfaceModel } from './model';

export interface Price extends InterfaceModel {
  price: number;
  dateStart: Date;
  dateEnd: Date;

  // base
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

export default Price;
