import { Request, Response } from 'express';

import knex from '../database';
import { DatabaseTable } from '../database/entitites/database';
import ListProducts from '../database/entitites/list_products';
import Lists from '../database/entitites/lists';
import Products, { selectColumnsProducts } from '../database/entitites/products';
import { deserialize, formatReferenceFieldUUId, isEmpty } from '../utils';
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
export async function create(req: Request, res: Response): Promise<Response | void> {
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
export async function remove(req: Request, res: Response): Promise<Response | void> {
  return baseRemove(res, req.params.uuid, req.body, Products);
}

export async function getAllByList(
  list_uuid: string,
): Promise<DatabaseTable | DatabaseTable[] | undefined> {
  if (!isEmpty(list_uuid)) {
    const selectFields = selectColumnsProducts.map((field) => {
      return `${Products.table_name}.${field['ref']} as ${field['_alias']}`;
    });

    return knex
      .select(selectFields)
      .from(ListProducts.table_name)
      .leftJoin(
        Products.table_name,
        `${ListProducts.table_name}.${formatReferenceFieldUUId(Products)}`,
        '=',
        `${Products.table_name}.${Products.mapping.uuid}`,
      )
      .where(`${ListProducts.table_name}.${formatReferenceFieldUUId(Lists)}`, list_uuid)
      .then((entries) => {
        return deserialize(entries, Products);
      })
      .catch((error: Error) => {
        console.error(error);
        return undefined;
      });
  }
}
