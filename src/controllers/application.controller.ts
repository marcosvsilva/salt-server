import { DatabaseTable, Entity } from '../database/entitites/database';
import { Request, Response } from 'express';
import { MissingRequestBodyException } from '../exceptions';
import { Knex } from 'knex';

import knex from '../database';
import { addIdentifiers, addTimestamps, deserialize, filterParams, isEmpty } from '../utils';

type Ref = Knex.Ref<
  string,
  {
    [x: string]: string;
  }
>[];

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
  return knex
    .select(selectColumns)
    .from(entity.table_name)
    .then((entries) => {
      if (doDeserialize) {
        return res.json(deserialize(entries, entity));
      }
      return res.json(entries);
    })
    .catch((error: Error) => {
      console.error(error);
      return res.sendStatus(500);
    });
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
  return knex
    .select(selectColumns)
    .from(entity.table_name)
    .where(entity.mapping.uuid, req.params.uuid)
    .limit(1)
    .first()
    .then((entry) => {
      if (entry) {
        if (doDeserialize) {
          return res.json(deserialize(entry, entity));
        }
        return res.json(entry);
      }
      return res.sendStatus(400);
    })
    .catch((error: Error) => {
      console.error(error);
      return res.sendStatus(500);
    });
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

export async function baseCreate({
  req,
  res,
  entity,
  selectColumns = [knex.ref('*')],
  doDeserialize = false,
  emptyResponse = false,
}: BaseCreateParameters): Promise<Response | void> {
  if (!req.body) {
    throw new MissingRequestBodyException();
  }

  let params = filterParams(req.body, entity);
  params = addIdentifiers(params, entity);
  params = addTimestamps(params, entity, 'create');

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
