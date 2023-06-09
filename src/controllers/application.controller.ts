import { DatabaseTable, Entity } from '../database/entitites/database';
import { Request, Response } from 'express';
import { Knex } from 'knex';
import { JsonObject, JsonValue } from 'type-fest';
import { addIdentifiers, addTimestamps, deserialize, filterParams, formatReferenceFieldUUId, isEmpty } from '../utils';
import knex from '../database';

type Ref = Knex.Ref<
  string,
  {
    [x: string]: string;
  }
>[];

/**
 * GetByID
 *
 */
async function getByID(
  selectColumns: Ref,
  tableName: string,
  idField: string,
  idValue: string,
): Promise<Response | void> {
  return knex
    .select(selectColumns)
    .from(tableName)
    .where(idField, idValue)
    .limit(1)
    .first()
    .then((entry) => {
      return entry;    
    })
    .catch((error: Error) => {
      console.log(error)
      return null;  
    });
}

/**
 * GetByAll
 *
 */
async function getAll(
  selectColumns: Ref,
  tableName: string,
): Promise<Response | void> {
  return knex
    .select(selectColumns)
    .from(tableName)
    .then((entries) => {
      return entries;
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });
}

/**
 * Index
 */
export async function baseIndex(
  req: Request,
  res: Response,
  entity: Entity<DatabaseTable>,
  selectColumns: Ref,
  doDeserialize = false,
): Promise<Response> {
  const entry = await getAll(selectColumns, entity.table_name);
  if (entry) {
    if (doDeserialize) {
      return res.json(deserialize(entry, entity));
    }
    return res.json(entry);
  }
  return res.sendStatus(500);
}

/**
 * Show
 *
 * @param {string} uuid
 */
export async function baseShow(
  req: Request,
  res: Response,
  entity: Entity<DatabaseTable>,
  selectColumns: Ref,
  doDeserialize = false,
): Promise<Response> {
  const entry = await getByID(selectColumns, entity.table_name, entity.mapping.uuid, req.params.uuid);
  if (entry) {
    if (doDeserialize) {
      return res.json(deserialize(entry, entity));
    }
    return res.json(entry);
  }
  return res.sendStatus(500);
}

/**
 * Create
 *
 * @param {string} uuid
 */

interface BaseCreateParameters {
  req: Request;
  res: Response;
  entity: Entity<DatabaseTable>;
  selectColumns?: Ref;
  doDeserialize?: boolean;
  emptyResponse?: boolean;
}

async function referenceFieldsIsValid(
  req: Request,
  res: Response,
  entity: Entity<DatabaseTable>,
  params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
): Promise<boolean> {
  let missingValues = true;

  if (entity.reference && params) {
    await Promise.all(entity.reference.map(async ent => {
      if (missingValues) {
        const field = formatReferenceFieldUUId(ent) || '';
        missingValues = !isEmpty(params[formatReferenceFieldUUId(ent)] as string);
      }
    }));
    
    if (!missingValues) {
      console.error('References fields not found')
    }
  }

  return missingValues;
}

export async function baseCreate({
  req,
  res,
  entity,
  selectColumns = [knex.ref('*')],
  doDeserialize = false,
  emptyResponse = false,
}: BaseCreateParameters): Promise<Response | void> {
  if (!req.body) {
    return res.sendStatus(400).end();
  }

  let params = filterParams(req.body, entity);
  params = addIdentifiers(params, entity);
  params = addTimestamps(params, entity, 'create');

  const checkReferences = await referenceFieldsIsValid(req, res, entity, params);
  if (!checkReferences) {
    return res.sendStatus(400).end();
  }
  
  if (emptyResponse) {
    return knex
      .insert(params)
      .into(entity.table_name)
      .limit(1)
      .then(() => res.status(201).end())
      .catch((error: Error) => {
        console.error(error);
        return res.status(500).end();
      });
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
    .then((_entry) => {
      let entry = _entry;
      if (doDeserialize) {
        entry = deserialize(_entry, entity);
      }
      return res.status(201).json(deserialize(entry, entity));
    })
    .catch((error: Error) => {
      console.error(error);
      return res.sendStatus(500);
    });
}

/**
 * Update
 *
 * @param {string} uuid
 */
export async function baseUpdate(
  req: Request,
  res: Response,
  entity: Entity<DatabaseTable>,
  selectColumns: Ref,
  doDeserialize = false,
): Promise<Response> {
  let params = filterParams(req.body, entity);
  params = addTimestamps(params, entity);

  return knex
    .transaction(async (trx: Knex.Transaction) => {
      return trx(entity.table_name)
        .update(params)
        .where(entity.mapping.uuid, req.params.uuid)
        .limit(1)
        .then(() =>
          trx
            .select(selectColumns)
            .from(entity.table_name)
            .where(entity.mapping.uuid, req.params.uuid)
            .limit(1)
            .first(),
        );
    })
    .then((entry) => {
      if (doDeserialize) {
        return res.json(deserialize(entry, entity));
      }
      return res.json(entry);
    })
    .catch((error: Error) => {
      console.error(error);
      return res.sendStatus(500);
    });
}

/**
 * Delete
 *
 * @param {string} uuid
 */
export async function baseRemove(
  req: Request,
  res: Response,
  entity: Entity<DatabaseTable>,
): Promise<Response | void> {
  return knex(entity.table_name)
    .where(entity.mapping.uuid, req.params.uuid)
    .limit(1)
    .delete()
    .then(() => res.status(204).end())
    .catch((error: Error) => {
      console.error(error);
      return res.status(500).end();
    });
}
