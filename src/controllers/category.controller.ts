import { Categories } from '../database/entitites';
import { ApplicationController } from './application.controller';

export class CategoryController extends ApplicationController {
  constructor() {
    super(Categories);
  }
}

export default CategoryController;
