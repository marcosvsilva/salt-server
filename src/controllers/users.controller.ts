import { Request, Response } from 'express';

import Users, { selectColumnsUsers } from '../database/entitites/users';
import { baseCreate, baseIndex, baseRemove, baseShow, baseUpdate } from './application.controller';

/**
 * @route GET /api/users
 */
export async function index(req: Request, res: Response): Promise<Response> {
  return baseIndex(res, Users, selectColumnsUsers);
}

/**
 * @route GET /api/users/:uuid
 * @param {string} uuid
 */
export async function show(req: Request, res: Response): Promise<Response> {
  return baseShow(res, req.params.uuid, Users, selectColumnsUsers);
}

/**
 * @route POST /api/users
 */
export async function create(req: Request, res: Response): Promise<Response> {
  return baseCreate(res, req.body, Users, selectColumnsUsers);
}

/**
 * @route PUT /api/users/:uuid
 * @param {string} uuid
 */
export async function update(req: Request, res: Response): Promise<Response> {
  return baseUpdate(res, req.params.uuid, req.body, Users, selectColumnsUsers);
}

/**
 * @route DELETE /api/users/:uuid
 * @param {string} uuid
 */
export async function remove(req: Request, res: Response): Promise<Response> {
  return baseRemove(res, req.params.uuid, req.body, Users);
}
