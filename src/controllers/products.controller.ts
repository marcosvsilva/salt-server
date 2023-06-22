import { Request, Response } from 'express';

import knex from '../database';
import ListProducts from '../database/entitites/list_products';
import Lists from '../database/entitites/lists';
import Products, { Product, selectColumnsProducts } from '../database/entitites/products';
import { InvalidUUIDException } from '../exceptions';
import { deserialize, formatReferenceFieldUUId, isEmpty, isValidUUID } from '../utils';
import { baseCreate, baseIndex, baseRemove, baseShow, baseUpdate } from './application.controller';

/**
 * @route GET /api/products
 */
export async function index(req: Request, res: Response): Promise<Response> {
  return baseIndex(res, Products, selectColumnsProducts);
}

/**
 * @route GET /api/products/:uuid
 * @param {string} uuid
 */
export async function show(req: Request, res: Response): Promise<Response> {
  return baseShow(res, req.params.uuid, Products, selectColumnsProducts);
}

/**
 * @route POST /api/products
 */
export async function create(req: Request, res: Response): Promise<Response> {
  return baseCreate(res, req.body, Products, selectColumnsProducts);
}

/**
 * @route PUT /api/products/:uuid
 * @param {string} uuid
 */
export async function update(req: Request, res: Response): Promise<Response> {
  return baseUpdate(res, req.params.uuid, req.body, Products, selectColumnsProducts);
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
    .select(selectColumnsProducts)
    .from(ListProducts.table_name)
    .leftJoin(
      Products.table_name,
      `${ListProducts.table_name}.${formatReferenceFieldUUId(Products)}`,
      '=',
      `${Products.table_name}.${Products.mapping.uuid}`,
    )
    .where(`${ListProducts.table_name}.${formatReferenceFieldUUId(Lists)}`, list_uuid)
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
