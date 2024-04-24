import { Users } from '../database/entitites';
import { ApplicationController } from './application.controller';

export class UserController extends ApplicationController {
  constructor() {
    super(Users);
  }
}

export default UserController;
