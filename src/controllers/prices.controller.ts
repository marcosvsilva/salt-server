import { Request, Response } from 'express';
import { baseCreate, baseIndex, baseRemove, baseShow, baseUpdate } from './application.controller';
import knex from '../database';
import Prices from '../database/entitites/prices';

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
  return baseIndex(req, res, Prices, selectColumns, true);
}

/**
 * @route GET /api/prices/:uuid
 * @param {string} uuid
 */
export async function show(req: Request, res: Response): Promise<Response> {
  return baseShow(req, res, Prices, selectColumns, true);
}

/**
 * @route POST /api/prices
 */
export async function create(req: Request, res: Response): Promise<Response | void> {
  return baseCreate({ req, res, entity: Prices, selectColumns, doDeserialize: true });
}

/**
 * @route PUT /api/prices/:uuid
 * @param {string} uuid
 */
export async function update(req: Request, res: Response): Promise<Response> {
  return baseUpdate(req, res, Prices, selectColumns, true);
}

/**
 * @route DELETE /api/prices/:uuid
 * @param {string} uuid
 */
export async function remove(req: Request, res: Response): Promise<Response | void> {
  return baseRemove(req, res, Prices);
}
