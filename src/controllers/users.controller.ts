import { Request, Response } from 'express';

import { InvalidUUIDException } from '../exceptions';
import { deserialize, formatReferenceFieldUUId, isValidUUID } from '../helpers';
import knex from '../repository';
import Lists from '../repository/entitites/lists';
import Users from '../repository/entitites/users';
import { User } from '../repository/models';
import { baseCreate, baseIndex, baseRemove, baseShow, baseUpdate } from './application.controller';

/**
 * @route GET /api/users
 */
export async function index(req: Request, res: Response): Promise<Response> {
  return baseIndex(res, Users);
}

/**
 * @route GET /api/users/:uuid
 * @param {string} uuid
 */
export async function show(req: Request, res: Response): Promise<Response> {
  return baseShow(res, req.params.uuid, Users);
}

/**
 * @route POST /api/users
 */
export async function create(req: Request, res: Response): Promise<Response> {
  return baseCreate(res, req.body, Users);
}

/**
 * @route PUT /api/users/:uuid
 * @param {string} uuid
 */
export async function update(req: Request, res: Response): Promise<Response> {
  return baseUpdate(res, req.params.uuid, req.body, Users);
}

/**
 * @route DELETE /api/users/:uuid
 * @param {string} uuid
 */
export async function remove(req: Request, res: Response): Promise<Response> {
  return baseRemove(res, req.params.uuid, Users);
}

export async function getByList(list_uuid: string): Promise<User> {
  if (!isValidUUID(list_uuid)) {
    throw new InvalidUUIDException();
  }

  return knex
    .select(Users.selectColumsRef)
    .from(Users.tableName)
    .leftJoin(
      Lists.tableName,
      `${Lists.tableName}.${formatReferenceFieldUUId(Users)}`,
      `${Users.tableName}.${Users.mapping.uuid}`
    )
    .where(`${Lists.tableName}.${Lists.mapping.uuid}`, list_uuid)
    .limit(1)
    .first()
    .then((entries) => {
      const file = deserialize(entries, Users);
      if (Array.isArray(file)) {
        return file[0] as User;
      }
      return file as User;
    })
    .catch((error: Error) => {
      throw error;
    });
}
