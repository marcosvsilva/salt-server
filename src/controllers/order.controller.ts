import { Orders } from '../database/entitites';
import { ApplicationController } from './application.controller';

export class OrderController extends ApplicationController {
  constructor() {
    super(Orders);
  }
}

export default OrderController;
