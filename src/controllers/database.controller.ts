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
} from '../helpers';

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
  entity: Entity<DatabaseTable>,
  idValue: string
): Promise<DatabaseTable> {
  if (!isValidUUID(idValue)) {
    throw new InvalidUUIDException();
  }

  return knex
    .select(entity.selectColumsRef)
    .from(entity.tableName)
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
  entity: Entity<DatabaseTable>,
  where?: Where[]
): Promise<DatabaseTable[]> {
  let query = knex.select(entity.selectColumsRef).from(entity.tableName);

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
  params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>
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
  entity: Entity<DatabaseTable>,
  _params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>
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
        .into(entity.tableName)
        .limit(1)
        .then(() =>
          trx
            .select(entity.selectColumsRef)
            .from(entity.tableName)
            .where(entity.mapping.uuid, uuid)
            .limit(1)
            .first()
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
  entity: Entity<DatabaseTable>,
  _params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
  uuid: string
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
      return trx(entity.tableName)
        .update(params)
        .where(entity.mapping.uuid, uuid)
        .limit(1)
        .then(() =>
          trx
            .select(entity.selectColumsRef)
            .from(entity.tableName)
            .where(entity.mapping.uuid, uuid)
            .limit(1)
            .first()
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
export async function remove(entity: Entity<DatabaseTable>, uuid: string): Promise<boolean> {
  if (!isValidUUID(uuid)) {
    throw new InvalidUUIDException();
  }

  return knex(entity.tableName)
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
