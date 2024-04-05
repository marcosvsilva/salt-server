import { InterfaceModel } from './model';

export enum StatusPayment {
  Created = 0,
  Processing = 1,
  Processed = 2,
  Refused = 3,
}

export interface Payment extends InterfaceModel {
  value: number;
  method: string;
  status: StatusPayment;

  // base
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

export default Payment;
