import { Request, Response } from 'express';

import Prices from '../database/entitites/prices';
import { baseCreate, baseIndex, baseRemove, baseShow, baseUpdate } from './application.controller';

/**
 * @route GET /api/prices
 */
export async function index(req: Request, res: Response): Promise<Response> {
  return baseIndex(res, Prices);
}

/**
 * @route GET /api/prices/:uuid
 * @param {string} uuid
 */
export async function show(req: Request, res: Response): Promise<Response> {
  return baseShow(res, req.params.uuid, Prices);
}

/**
 * @route POST /api/prices
 */
export async function create(req: Request, res: Response): Promise<Response> {
  return baseCreate(res, req.body, Prices);
}

/**
 * @route PUT /api/prices/:uuid
 * @param {string} uuid
 */
export async function update(req: Request, res: Response): Promise<Response> {
  return baseUpdate(res, req.params.uuid, req.body, Prices);
}

/**
 * @route DELETE /api/prices/:uuid
 * @param {string} uuid
 */
export async function remove(req: Request, res: Response): Promise<Response> {
  return baseRemove(res, req.params.uuid, Prices);
}
