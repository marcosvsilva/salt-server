import { Knex } from 'knex';
import { JsonObject, JsonValue } from 'type-fest';

import { InterfaceModel } from '../models';

export interface Where {
  field: string;
  operator: string;
  value: string;
}

export interface InterfaceRepository {
  getByID(idValue: string): Promise<InterfaceModel>;

  getAll(where?: Where[]): Promise<InterfaceModel[]>;

  create(
    params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>
  ): Promise<InterfaceModel>;

  update(
    params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
    uuid: string
  ): Promise<InterfaceModel>;

  delete(uuid: string): Promise<boolean>;
}

export default InterfaceRepository;
