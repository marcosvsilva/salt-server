import { Prices } from '../database/entitites';
import { ApplicationController } from './application.controller';

export class PriceController extends ApplicationController {
  constructor() {
    super(Prices);
  }
}

export default PriceController;
