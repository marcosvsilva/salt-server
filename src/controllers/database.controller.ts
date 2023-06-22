import { Knex } from 'knex';
import { JsonObject, JsonValue } from 'type-fest';

import knex from '../database';
import { DatabaseTable, Entity } from '../database/entitites/database';
import {
  InvalidUUIDException,
  MissingParamsException,
  MissingReferencesFieldsException,
} from '../exceptions';
import {
  addIdentifiers,
  addTimestamps,
  deserialize,
  filterParams,
  formatReferenceFieldUUId,
  isEmpty,
  isValidUUID,
} from '../utils';

export type Ref = Knex.Ref<
  string,
  {
    [x: string]: string;
  }
>[];

export interface Where {
  field: string;
  operator: string;
  value: string;
}

/**
 * GetByID
 *
 */
export async function getByID(
  idValue: string,
  selectColumns: Ref,
  entity: Entity<DatabaseTable>,
): Promise<DatabaseTable> {
  if (!isValidUUID(idValue)) {
    throw new InvalidUUIDException();
  }

  return knex
    .select(selectColumns)
    .from(entity.table_name)
    .where(entity.mapping.uuid, idValue)
    .limit(1)
    .first()
    .then((entry) => {
      if (entry) {
        const files = deserialize(entry, entity);
        if (Array.isArray(files)) {
          return files[0];
        }
        return files;
      }
      return {} as DatabaseTable;
    })
    .catch((error: Error) => {
      console.log(error);
      throw error;
    });
}

/**
 * GetByAll
 *
 */
export async function getAll(
  selectColumns: Ref,
  entity: Entity<DatabaseTable>,
  where?: Where[],
): Promise<DatabaseTable[]> {
  let query = knex.select(selectColumns).from(entity.table_name);

  if (where && where?.length > 0) {
    Array.from(where).forEach((condition) => {
      query = query.where(condition.field, condition.operator, condition.value);
    });
  }

  return query
    .then((entries) => {
      const files = deserialize(entries, entity);
      if (Array.isArray(files)) {
        return files;
      }
      return [files] as DatabaseTable[];
    })
    .catch((error: Error) => {
      throw error;
    });
}

/**
 * Create
 *
 */

function referenceFieldsIsValid(
  entity: Entity<DatabaseTable>,
  params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
): boolean {
  let missingValues = true;
  if (entity.reference && params) {
    const entities = [...entity.reference] as Entity<DatabaseTable>[];
    entities.forEach((ent) => {
      if (missingValues) {
        const field = formatReferenceFieldUUId(ent) || '';
        missingValues = !isEmpty(params[field] as string);
      }
    });
  }

  return missingValues;
}

export async function create(
  _params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
  entity: Entity<DatabaseTable>,
  selectColumns: Ref,
): Promise<DatabaseTable> {
  if (!_params) {
    throw new MissingParamsException();
  }

  let params = filterParams(_params, entity);
  params = addTimestamps(params, entity, 'create');
  params = addIdentifiers(params, entity);

  const checkReferences = referenceFieldsIsValid(entity, params);
  if (!checkReferences) {
    throw new MissingReferencesFieldsException();
  }

  const uuid = params[entity.mapping.uuid] as string;
  return knex
    .transaction(async (trx: Knex.Transaction) => {
      return trx
        .insert(params)
        .into(entity.table_name)
        .limit(1)
        .then(() =>
          trx
            .select(selectColumns)
            .from(entity.table_name)
            .where(entity.mapping.uuid, uuid)
            .limit(1)
            .first(),
        );
    })
    .then((entry) => {
      const files = deserialize(entry, entity);
      if (Array.isArray(files)) {
        return files[0];
      }
      return files;
    })
    .catch((error: Error) => {
      throw error;
    });
}

/**
 * Update
 *
 */
export async function update(
  _params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
  uuid: string,
  entity: Entity<DatabaseTable>,
  selectColumns: Ref,
): Promise<DatabaseTable> {
  if (!isValidUUID(uuid)) {
    throw new InvalidUUIDException();
  }

  if (!_params) {
    throw new MissingParamsException();
  }

  let params = filterParams(_params, entity);
  params = addTimestamps(params, entity);

  return knex
    .transaction(async (trx: Knex.Transaction) => {
      return trx(entity.table_name)
        .update(params)
        .where(entity.mapping.uuid, uuid)
        .limit(1)
        .then(() =>
          trx
            .select(selectColumns)
            .from(entity.table_name)
            .where(entity.mapping.uuid, uuid)
            .limit(1)
            .first(),
        );
    })
    .then((entry) => {
      const files = deserialize(entry, entity);
      if (Array.isArray(files)) {
        return files[0];
      }
      return files;
    })
    .catch((error: Error) => {
      throw error;
    });
}

/**
 * Remove
 *
 */
export async function remove(uuid: string, entity: Entity<DatabaseTable>): Promise<boolean> {
  if (!isValidUUID(uuid)) {
    throw new InvalidUUIDException();
  }

  return knex(entity.table_name)
    .where(entity.mapping.uuid, uuid)
    .limit(1)
    .delete()
    .then((result) => {
      return !!result;
    })
    .catch((error: Error) => {
      throw error;
    });
}
