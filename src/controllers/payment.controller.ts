import { Payments } from '../database/entitites';
import { ApplicationController } from './application.controller';

export class PaymentController extends ApplicationController {
  constructor() {
    super(Payments);
  }
}

export default PaymentController;
