import { Request, Response } from 'express';
import { baseCreate, baseIndex, baseRemove, baseShow, baseUpdate } from './application.controller';
import knex from '../database';
import Users from '../database/entitites/users';

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
  return baseIndex(req, res, Users, selectColumns, true);
}

/**
 * @route GET /api/users/:uuid
 * @param {string} uuid
 */
export async function show(req: Request, res: Response): Promise<Response> {
  return baseShow(req, res, Users, selectColumns, true);
}

/**
 * @route POST /api/users
 */
export async function create(req: Request, res: Response): Promise<Response | void> {
  console.log(req);
  return baseCreate({ req, res, entity: Users, selectColumns, doDeserialize: true });
}

/**
 * @route PUT /api/users/:uuid
 * @param {string} uuid
 */
export async function update(req: Request, res: Response): Promise<Response> {
  return baseUpdate(req, res, Users, selectColumns, true);
}

/**
 * @route DELETE /api/users/:uuid
 * @param {string} uuid
 */
export async function remove(req: Request, res: Response): Promise<Response | void> {
  return baseRemove(req, res, Users);
}
