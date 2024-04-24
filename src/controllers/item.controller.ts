import { Itens } from '../database/entitites';
import { ApplicationController } from './application.controller';

export class ItemController extends ApplicationController {
  constructor() {
    super(Itens);
  }
}

export default ItemController;
