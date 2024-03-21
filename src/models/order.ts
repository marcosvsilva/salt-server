import { DatabaseTable } from './database';
import { Item } from './item';
import { Payment } from './payment';
import { User } from './user';

export enum StatusOrder {
  Created = 0,
  WaitingDelivery = 1,
  Finished = 2,
  Canceled = 3,
}

export enum TypeOrder {
  OnSite = 0,
  Delivery = 1,
}

export interface Order extends DatabaseTable {
  notes: string;
  status: StatusOrder;
  type: TypeOrder;

  // database
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
