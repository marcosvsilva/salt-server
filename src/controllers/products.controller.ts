import { Request, Response } from 'express';

import knex from '../database';
import ListProducts from '../database/entitites/list_products';
import Lists from '../database/entitites/lists';
import Products, { Product } from '../database/entitites/products';
import { InvalidUUIDException } from '../exceptions';
import { deserialize, formatReferenceFieldUUId, isValidUUID } from '../utils';
import { baseCreate, baseIndex, baseRemove, baseShow, baseUpdate } from './application.controller';

/**
 * @route GET /api/products
 */
export async function index(req: Request, res: Response): Promise<Response> {
  return baseIndex(res, Products);
}

/**
 * @route GET /api/products/:uuid
 * @param {string} uuid
 */
export async function show(req: Request, res: Response): Promise<Response> {
  return baseShow(res, req.params.uuid, Products);
}

/**
 * @route POST /api/products
 */
export async function create(req: Request, res: Response): Promise<Response> {
  return baseCreate(res, req.body, Products);
}

/**
 * @route PUT /api/products/:uuid
 * @param {string} uuid
 */
export async function update(req: Request, res: Response): Promise<Response> {
  return baseUpdate(res, req.params.uuid, req.body, Products);
}

/**
 * @route DELETE /api/products/:uuid
 * @param {string} uuid
 */
export async function remove(req: Request, res: Response): Promise<Response> {
  return baseRemove(res, req.params.uuid, Products);
}

export async function getAllByList(list_uuid: string): Promise<Product[]> {
  if (!isValidUUID(list_uuid)) {
    throw new InvalidUUIDException();
  }

  return knex
    .select(Products.selectColumsRef)
    .from(ListProducts.tableName)
    .leftJoin(
      Products.tableName,
      `${ListProducts.tableName}.${formatReferenceFieldUUId(Products)}`,
      '=',
      `${Products.tableName}.${Products.mapping.uuid}`,
    )
    .where(`${ListProducts.tableName}.${formatReferenceFieldUUId(Lists)}`, list_uuid)
    .then((entries) => {
      const files = deserialize(entries, Products);
      if (Array.isArray(files)) {
        return files as Product[];
      }
      return [files] as Product[];
    })
    .catch((error: Error) => {
      throw error;
    });
}
