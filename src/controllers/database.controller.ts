import { Knex } from 'knex';
import { JsonObject, JsonValue } from 'type-fest';

import knex from '../database';
import { DatabaseTable, Entity } from '../database/entitites/database';
import {
  MissingIdException,
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
): Promise<DatabaseTable | DatabaseTable[] | undefined> {
  return knex
    .select(selectColumns)
    .from(entity.table_name)
    .where(entity.mapping.uuid, idValue)
    .limit(1)
    .first()
    .then((entry) => {
      return deserialize(entry, entity);
    })
    .catch((error: Error) => {
      console.log(error);
      return undefined;
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
): Promise<DatabaseTable | DatabaseTable[] | undefined> {
  let query = knex.select(selectColumns).from(entity.table_name);

  if (where && where?.length > 0) {
    Array.from(where).forEach((condition) => {
      query = query.where(condition.field, condition.operator, condition.value);
    });
  }

  return query
    .then((entries) => {
      return deserialize(entries, entity);
    })
    .catch((error: Error) => {
      console.error(error);
      return undefined;
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
): Promise<DatabaseTable | DatabaseTable[] | undefined | void> {
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
      return deserialize(entry, entity);
    })
    .catch((error: Error) => {
      console.error(error);
      return undefined;
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
): Promise<DatabaseTable | DatabaseTable[] | undefined> {
  if (uuid.length == 0) {
    throw new MissingIdException();
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
      return deserialize(entry, entity);
    })
    .catch((error: Error) => {
      console.error(error);
      return undefined;
    });
}

/**
 * Remove
 *
 */
export async function remove(
  params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
  uuid: string,
  entity: Entity<DatabaseTable>,
): Promise<void> {
  if (uuid.length == 0) {
    throw MissingIdException;
  }

  return knex(entity.table_name)
    .where(entity.mapping.uuid, uuid)
    .limit(1)
    .delete()
    .then((entry) => {})
    .catch((error: Error) => {
      console.error(error);
      throw error;
    });
}
