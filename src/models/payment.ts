import { DatabaseTable } from './database';

export enum StatusPayment {
  Created = 0,
  Waiting = 1,
  Processed = 2,
  Refused = 3,
}

export interface Payment extends DatabaseTable {
  value: number;
  method: string;
  status: StatusPayment;

  // database
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

export default Payment;
