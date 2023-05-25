import { Request, Response } from 'express';
import { baseCreate, baseIndex, baseRemove, baseShow, baseUpdate } from './application.controller';
import knex from '../database';
import Lists from '../database/entitites/lists';

const selectColumns = [
  knex.ref(Lists.mapping.uuid).as(Lists.column.uuid),
  knex.ref(Lists.mapping.name).as(Lists.column.name),
  knex.ref(Lists.mapping.status).as(Lists.column.status),
  knex.ref(Lists.mapping.total_list).as(Lists.column.total_list),
  knex.ref(Lists.mapping.discount).as(Lists.column.discount),
  knex.ref(Lists.mapping.date_completed).as(Lists.column.date_completed),
  knex.ref(Lists.mapping.createdAt).as(Lists.column.createdAt),
  knex.ref(Lists.mapping.updatedAt).as(Lists.column.updatedAt),
];

/**
 * @route GET /api/lists
 */
export async function index(req: Request, res: Response): Promise<Response> {
  return baseIndex(req, res, Lists, selectColumns, true);
}

/**
 * @route GET /api/lists/:uuid
 * @param {string} uuid
 */
export async function show(req: Request, res: Response): Promise<Response> {
  return baseShow(req, res, Lists, selectColumns, true);
}

/**
 * @route POST /api/lists
 */
export async function create(req: Request, res: Response): Promise<Response | void> {
  return baseCreate({ req, res, entity: Lists, selectColumns, doDeserialize: true });
}

/**
 * @route PUT /api/lists/:uuid
 * @param {string} uuid
 */
export async function update(req: Request, res: Response): Promise<Response> {
  return baseUpdate(req, res, Lists, selectColumns, true);
}

/**
 * @route DELETE /api/lists/:uuid
 * @param {string} uuid
 */
export async function remove(req: Request, res: Response): Promise<Response | void> {
  return baseRemove(req, res, Lists);
}
