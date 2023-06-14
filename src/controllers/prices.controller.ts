import { Request, Response } from 'express';

import knex from '../database';
import Prices from '../database/entitites/prices';
import { baseCreate, baseIndex, baseRemove, baseShow, baseUpdate } from './application.controller';

const selectColumns = [
  knex.ref(Prices.mapping.uuid).as(Prices.column.uuid),
  knex.ref(Prices.mapping.date).as(Prices.column.date),
  knex.ref(Prices.mapping.price).as(Prices.column.price),
  knex.ref(Prices.mapping.createdAt).as(Prices.column.createdAt),
  knex.ref(Prices.mapping.updatedAt).as(Prices.column.updatedAt),
];

/**
 * @route GET /api/prices
 */
export async function index(req: Request, res: Response): Promise<Response> {
  return baseIndex(res, Prices, selectColumns);
}

/**
 * @route GET /api/prices/:uuid
 * @param {string} uuid
 */
export async function show(req: Request, res: Response): Promise<Response> {
  return baseShow(res, req.params.uuid, Prices, selectColumns);
}

/**
 * @route POST /api/prices
 */
export async function create(req: Request, res: Response): Promise<Response | void> {
  return baseCreate(res, req.body, Prices, selectColumns);
}

/**
 * @route PUT /api/prices/:uuid
 * @param {string} uuid
 */
export async function update(req: Request, res: Response): Promise<Response> {
  return baseUpdate(res, req.params.uuid, req.body, Prices, selectColumns);
}

/**
 * @route DELETE /api/prices/:uuid
 * @param {string} uuid
 */
export async function remove(req: Request, res: Response): Promise<Response | void> {
  return baseRemove(res, req.params.uuid, req.body, Prices);
}
