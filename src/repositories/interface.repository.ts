import { Knex } from 'knex';
import { JsonObject, JsonValue } from 'type-fest';

import { DatabaseTable } from '../models/database';

export interface Where {
  field: string;
  operator: string;
  value: string;
}

export interface InterfaceRepository {
  getByID(idValue: string): Promise<DatabaseTable>;

  getAll(where?: Where[]): Promise<DatabaseTable[]>;

  create(
    params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>
  ): Promise<DatabaseTable>;

  update(
    params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
    uuid: string
  ): Promise<DatabaseTable>;

  delete(uuid: string): Promise<boolean>;
}

export default InterfaceRepository;
