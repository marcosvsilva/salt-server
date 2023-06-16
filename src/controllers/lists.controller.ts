import { Request, Response } from 'express';
import { JsonObject } from 'type-fest';

import { DatabaseTable } from '../database/entitites/database';
import ListProducts, {
  selectColumnsListProducts,
  StatusListProduct,
} from '../database/entitites/list_products';
import Lists, { selectColumnsLists } from '../database/entitites/lists';
import Products from '../database/entitites/products';
import { MissingParamsException, MissingReferencesFieldsException } from '../exceptions';
import { formatReferenceFieldUUId, isEmpty } from '../utils';
import { baseRemove, baseShow, baseUpdate } from './application.controller';
import { create as databaseCreate, getAll as databaseIndex } from './database.controller';
import { getAllByList } from './products.controller';

/**
 * @route GET /api/lists
 */
export async function index(req: Request, res: Response): Promise<Response> {
  try {
    const lists = await databaseIndex(selectColumnsLists, Lists);

    if (lists && Array(lists).length > 0) {
      for (const index in lists) {
        const products = await getAllByList((lists[index] as DatabaseTable).uuid);

        if (products && (products as DatabaseTable[]).length > 0) {
          lists[index]['products'] = products;
        }
      }

      return res.status(200).json(lists).end();
    }
    return res.status(200).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}

/**
 * @route GET /api/lists/:uuid
 * @param {string} uuid
 */
export async function show(req: Request, res: Response): Promise<Response> {
  return baseShow(res, req.params.uuid, Lists, selectColumnsLists);
}

/**
 * @route POST /api/lists
 */
export async function create(req: Request, res: Response): Promise<Response | void> {
  if (req.body) {
    try {
      const list = await databaseCreate(req.body, Lists, selectColumnsLists);

      if (list) {
        if (req.body['products']) {
          linkProducts(list['uuid'], req.body['products'] as string[]);
        }
        return res.status(201).json(list).end();
      }
      return res.status(500).end();
    } catch (error) {
      console.error(error);
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
  return baseUpdate(res, req.params.uuid, req.body, Lists, selectColumnsLists);
}

/**
 * @route DELETE /api/lists/:uuid
 * @param {string} uuid
 */
export async function remove(req: Request, res: Response): Promise<Response | void> {
  return baseRemove(res, req.params.uuid, req.body, Lists);
}

function linkProducts(listUUID: string, products: string[]): void {
  if (Array.isArray(products)) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    products.forEach(async (prod) => {
      const form: JsonObject = {
        [formatReferenceFieldUUId(Lists)]: listUUID,
        [formatReferenceFieldUUId(Products)]: prod,
        date: new Date().toJSON(),
        status: JSON.stringify(StatusListProduct.Create),
      };

      const listProduct = await databaseCreate(form, ListProducts, selectColumnsListProducts);

      if (!listProduct || isEmpty(listProduct['uuid'] as string)) {
        console.error(`error to link product: ${prod} in ${listUUID} list`);
      }
    });
  }
}
