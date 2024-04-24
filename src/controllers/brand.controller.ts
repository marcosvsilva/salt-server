import { Brands } from '../database/entitites';
import { ApplicationController } from './application.controller';

export class BrandController extends ApplicationController {
  constructor() {
    super(Brands);
  }
}

export default BrandController;
