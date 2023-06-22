import { Response } from 'express';
import { Knex } from 'knex';
import { JsonObject, JsonValue } from 'type-fest';

import { DatabaseTable, Entity } from '../database/entitites/database';
import {
  InvalidUUIDException,
  MissingParamsException,
  MissingReferencesFieldsException,
} from '../exceptions';
import { isEmpty } from '../utils';
import { create, getAll, getByID, Ref, remove, update } from './database.controller';

/**
 * Index
 */
export async function baseIndex(
  res: Response,
  entity: Entity<DatabaseTable>,
  selectColumns: Ref,
): Promise<Response> {
  try {
    const entries = await getAll(selectColumns, entity);
    if (entries) {
      if (Array.isArray(entries) && Array.from(entries).length > 0) {
        return res.status(200).json(entries).end();
      }
      return res.status(200).json({}).end();
    }
    return res.status(400).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}

/**
 * Show
 *
 */
export async function baseShow(
  res: Response,
  uuid: string,
  entity: Entity<DatabaseTable>,
  selectColumns: Ref,
): Promise<Response> {
  try {
    const entry = await getByID(uuid, selectColumns, entity);
    if (!isEmpty(entry)) {
      return res.status(200).json(entry).end();
    }
    return res.status(404).end();
  } catch (error) {
    if (error instanceof InvalidUUIDException) {
      return res.status(400).json(error.message).end();
    }
    console.error(error);
    return res.status(500).end();
  }
}

/**
 * Create
 *
 */
export async function baseCreate(
  res: Response,
  params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
  entity: Entity<DatabaseTable>,
  selectColumns: Ref,
  emptyResponse = false,
): Promise<Response> {
  try {
    const data = await create(params, entity, selectColumns);
    if (!isEmpty(data)) {
      if (emptyResponse) {
        return res.status(201).end();
      }
      return res.status(201).json(data).end();
    }
    return res.status(400).end();
  } catch (error) {
    if (
      error instanceof MissingReferencesFieldsException ||
      error instanceof MissingParamsException
    ) {
      return res.status(400).json(error.message).end();
    }
    console.error(error);
    return res.status(500).end();
  }
}

/**
 * Update
 *
 */
export async function baseUpdate(
  res: Response,
  uuid: string,
  params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
  entity: Entity<DatabaseTable>,
  selectColumns: Ref,
): Promise<Response> {
  try {
    const data = await update(params, uuid, entity, selectColumns);
    if (!isEmpty(data)) {
      return res.status(200).json(data).end();
    }
    return res.status(400).end();
  } catch (error) {
    if (error instanceof InvalidUUIDException || error instanceof MissingParamsException) {
      res.status(400).json(error.message).end();
    }
    console.error(error);
    return res.status(500).end();
  }
}

/**
 * Remove
 *
 */
export async function baseRemove(
  res: Response,
  uuid: string,
  entity: Entity<DatabaseTable>,
): Promise<Response> {
  try {
    const removed = await remove(uuid, entity);
    if (!isEmpty(removed)) {
      return res.status(204).end();
    }
    return res.status(400).end();
  } catch (error) {
    if (error instanceof InvalidUUIDException) {
      return res.status(400).json(error.message).end();
    }
    console.error(error);
    return res.status(500).end();
  }
}
