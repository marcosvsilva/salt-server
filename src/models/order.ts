import { Item } from './item';
import { InterfaceModel } from './model';
import { Payment } from './payment';
import { User } from './user';

export enum StatusOrder {
  Created = 0,
  Paid = 1,
  Processing = 2,
  OnWay = 3,
  Received = 4,
  Finished = 5,
  Canceled = 6,
  Deleted = 7,
}

export enum TypeOrder {
  OnSite = 0,
  Table = 1,
  Delivery = 2,
}

export interface Order extends InterfaceModel {
  type: TypeOrder;
  discount: number;
  totalPrice: number;
  status: StatusOrder;
  notes: string;

  // base
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;

  // references
  user?: User;
  itens?: Item[];
  payments?: Payment[];
}

export default Order;
