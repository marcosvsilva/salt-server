import { Response } from 'express';
import { Knex } from 'knex';
import { JsonObject, JsonValue } from 'type-fest';

import { DatabaseTable, Entity } from '../database/entitites/database';
import MissingParamsException from '../exceptions/missing_params';
import MissingReferencesFieldsException from '../exceptions/missing_references_fields';
import { create, getAll, getByID, Ref, remove, update } from './database.controller';

/**
 * Index
 */
export async function baseIndex(
  res: Response,
  entity: Entity<DatabaseTable>,
  selectColumns: Ref,
): Promise<Response> {
  const entries = await getAll(selectColumns, entity);
  try {
    if (entries) {
      return res.status(200).json(entries).end();
    }
    return res.status(200).json({}).end();
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
  if (uuid.length === 0) {
    return res.status(400).end();
  }

  const entry = await getByID(uuid, selectColumns, entity);
  try {
    if (entry) {
      return res.status(200).json(entry).end();
    }
    return res.status(404).end();
  } catch (error) {
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
  if (!params) {
    return res.status(400).end();
  }

  try {
    const data = await create(params, entity, selectColumns);
    if (data && data !== undefined) {
      if (emptyResponse) {
        return res.status(201).end();
      }
      return res.status(201).json(data).end();
    }
    return res.status(404).end();
  } catch (error) {
    console.error(error);
    if (
      error instanceof MissingReferencesFieldsException ||
      error instanceof MissingParamsException
    ) {
      return res.status(400).end();
    }
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
  if (uuid.length === 0) {
    return res.status(400).end();
  }

  try {
    const data = await update(params, uuid, entity, selectColumns);
    if (data) {
      return res.status(200).json(data).end();
    }
    return res.status(404).end();
  } catch (error) {
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
  params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
  entity: Entity<DatabaseTable>,
): Promise<Response> {
  if (uuid.length === 0) {
    return res.status(400).end();
  }

  try {
    const removed = await remove(params, uuid, entity);
    if (removed) {
      return res.status(204).end();
    }
    return res.status(404).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}
