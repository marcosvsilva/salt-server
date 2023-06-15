import { Request, Response } from 'express';
import { JsonObject } from 'type-fest';

import knex from '../database';
import ListProducts from '../database/entitites/list_products';
import Lists, { StatusList } from '../database/entitites/lists';
import Products from '../database/entitites/products';
import { MissingParamsException, MissingReferencesFieldsException } from '../exceptions';
import { formatReferenceFieldUUId, isEmpty } from '../utils';
import { baseIndex, baseRemove, baseShow, baseUpdate } from './application.controller';
import { create as databaseCreate } from './database.controller';

const selectColumns = [
  knex.ref(Lists.mapping.uuid).as(Lists.column.uuid),
  knex.ref(Lists.mapping.name).as(Lists.column.name),
  knex.ref(Lists.mapping.status).as(Lists.column.status),
  knex.ref(Lists.mapping.total_list).as(Lists.column.total_list),
  knex.ref(Lists.mapping.discount).as(Lists.column.discount),
  knex.ref(Lists.mapping.date_completed).as(Lists.column.date_completed),
  knex.ref(Lists.mapping.createdAt).as(Lists.column.createdAt),
  knex.ref(Lists.mapping.updatedAt).as(Lists.column.updatedAt),
];

const selectColumnsListProducts = [
  knex.ref(ListProducts.mapping.uuid).as(ListProducts.column.uuid),
  knex.ref(ListProducts.mapping.date).as(ListProducts.column.date),
  knex.ref(ListProducts.mapping.status).as(ListProducts.column.status),
  knex.ref(ListProducts.mapping.createdAt).as(ListProducts.column.createdAt),
  knex.ref(ListProducts.mapping.updatedAt).as(ListProducts.column.updatedAt),
];

/**
 * @route GET /api/lists
 */
export async function index(req: Request, res: Response): Promise<Response> {
  return baseIndex(res, Lists, selectColumns);
}

/**
 * @route GET /api/lists/:uuid
 * @param {string} uuid
 */
export async function show(req: Request, res: Response): Promise<Response> {
  return baseShow(res, req.params.uuid, Lists, selectColumns);
}

/**
 * @route POST /api/lists
 */
export async function create(req: Request, res: Response): Promise<Response | void> {
  if (req.body) {
    try {
      const list = await databaseCreate(req.body, Lists, selectColumns);

      if (list && !isEmpty(list['uuid'] as string)) {
        if (req.body['products']) {
          const products = Array.from(req.body['products']);

          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          products.forEach(async (prod) => {
            const form: JsonObject = {
              [formatReferenceFieldUUId(Lists)]: list['uuid'] as string,
              [formatReferenceFieldUUId(Products)]: prod as string,
              date: new Date().toJSON(),
              status: StatusList.Create,
            };

            const listProduct = await databaseCreate(form, ListProducts, selectColumnsListProducts);

            if (!listProduct || isEmpty(listProduct['uuid'] as string)) {
              console.error(`error to link product: ${prod} in ${list['uuid'] as string} list`);
            }
          });
        }
        return res.status(201).json(list).end();
      }
    } catch (error) {
      if (
        error instanceof MissingParamsException ||
        error instanceof MissingReferencesFieldsException
      ) {
        return res.status(400).end();
      }
      return res.status(500).end();
    }
  }
  return res.status(400).end();
}

/**
 * @route PUT /api/lists/:uuid
 * @param {string} uuid
 */
export async function update(req: Request, res: Response): Promise<Response> {
  return baseUpdate(res, req.params.uuid, req.body, Lists, selectColumns);
}

/**
 * @route DELETE /api/lists/:uuid
 * @param {string} uuid
 */
export async function remove(req: Request, res: Response): Promise<Response | void> {
  return baseRemove(res, req.params.uuid, req.body, Lists);
}
