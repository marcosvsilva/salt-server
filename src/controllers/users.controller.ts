import { Request, Response } from 'express';

import knex from '../database';
import Users from '../database/entitites/users';
import { baseCreate, baseIndex, baseRemove, baseShow, baseUpdate } from './application.controller';

const selectColumns = [
  knex.ref(Users.mapping.uuid).as(Users.column.uuid),
  knex.ref(Users.mapping.name).as(Users.column.name),
  knex.ref(Users.mapping.user_name).as(Users.column.user_name),
  knex.ref(Users.mapping.password).as(Users.column.password),
  knex.ref(Users.mapping.createdAt).as(Users.column.createdAt),
  knex.ref(Users.mapping.updatedAt).as(Users.column.updatedAt),
];

/**
 * @route GET /api/users
 */
export async function index(req: Request, res: Response): Promise<Response> {
  return baseIndex(res, Users, selectColumns);
}

/**
 * @route GET /api/users/:uuid
 * @param {string} uuid
 */
export async function show(req: Request, res: Response): Promise<Response> {
  return baseShow(res, req.params.uuid, Users, selectColumns);
}

/**
 * @route POST /api/users
 */
export async function create(req: Request, res: Response): Promise<Response | void> {
  return baseCreate(res, req.body, Users, selectColumns);
}

/**
 * @route PUT /api/users/:uuid
 * @param {string} uuid
 */
export async function update(req: Request, res: Response): Promise<Response> {
  return baseUpdate(res, req.params.uuid, req.body, Users, selectColumns);
}

/**
 * @route DELETE /api/users/:uuid
 * @param {string} uuid
 */
export async function remove(req: Request, res: Response): Promise<Response | void> {
  return baseRemove(res, req.params.uuid, req.body, Users);
}
