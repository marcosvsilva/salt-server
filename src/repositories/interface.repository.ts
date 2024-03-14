import { Knex } from 'knex';
import { JsonObject, JsonValue } from 'type-fest';

import { DatabaseTable, Entity } from '../models/database';

export interface Where {
  field: string;
  operator: string;
  value: string;
}

export interface RepositoryInterface {
  getByID(entity: Entity<DatabaseTable>, idValue: string): Promise<DatabaseTable>;

  getAll(entity: Entity<DatabaseTable>, where?: Where[]): Promise<DatabaseTable[]>;

  create(
    entity: Entity<DatabaseTable>,
    params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>
  ): Promise<DatabaseTable>;

  update(
    entity: Entity<DatabaseTable>,
    params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
    uuid: string
  ): Promise<void>;

  delete(uuid: string): Promise<boolean>;
}

export default RepositoryInterface;
