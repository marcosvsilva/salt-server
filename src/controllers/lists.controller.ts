import { Request, Response } from 'express';
import { JsonObject } from 'type-fest';

import knex from '../database';
import ListProducts, {
  selectColumnsListProducts,
  StatusListProduct,
} from '../database/entitites/list_products';
import Lists, { List, selectColumnsLists } from '../database/entitites/lists';
import Products from '../database/entitites/products';
import MissingParamsException from '../exceptions/missing_params';
import MissingReferencesFieldsException from '../exceptions/missing_references_fields';
import { formatReferenceFieldUUId, isEmpty } from '../utils';
import { baseRemove, baseUpdate } from './application.controller';
import {
  create as databaseCreate,
  getAll as databaseIndex,
  getByID as databaseShow,
} from './database.controller';
import { getAllByList } from './products.controller';

/**
 * @route GET /api/lists
 */
export async function index(req: Request, res: Response): Promise<Response> {
  try {
    const lists = await databaseIndex(selectColumnsLists, Lists);

    for (const indexList in lists) {
      if (indexList) {
        const products = await getAllByList((lists[indexList] as List).uuid);

        if (products) {
          (lists[indexList] as List).products = products;
        }
      }
    }
    return res.status(200).json(lists).end();
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
  try {
    if (req.params && (req.params.uuid as string).length > 0) {
      const list = await databaseShow(req.params.uuid, selectColumnsLists, Lists);

      if (list) {
        const products = await getAllByList((list as List).uuid);

        if (products) {
          (list as List).products = products;
        }

        return res.status(200).json(list).end();
      }
    }
    return res.status(400).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}

/**
 * @route POST /api/lists
 */
export async function create(req: Request, res: Response): Promise<Response | void> {
  try {
    if (req.body) {
      const list = await databaseCreate(req.body, Lists, selectColumnsLists);

      if (list) {
        try {
          await linkProducts((list as List).uuid, req.body.products as string[]);
        } catch (error) {
          res.status(400).end();
        }
        return res.status(201).json(list).end();
      }
    }
    return res.status(400).end();
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

async function linkProducts(listUUID: string, products: string[]): Promise<void> {
  if (products && Array.isArray(products)) {
    for (const i in products) {
      if (products[i]) {
        const form: JsonObject = {
          [formatReferenceFieldUUId(Lists)]: listUUID,
          [formatReferenceFieldUUId(Products)]: products[i],
          date: new Date().toJSON(),
          status: JSON.stringify(StatusListProduct.Create),
        };

        const listProduct = await databaseCreate(form, ListProducts, selectColumnsListProducts);

        if (!listProduct || isEmpty(listProduct.uuid)) {
          console.error(`error to link product: ${products[i]} in ${listUUID} list`);
        }
      }
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function removeProductsList(listUUID: string): Promise<void> {
  if (listUUID.length > 0) {
    const products = await getAllByList(listUUID);

    if (products && Array.isArray(products)) {
      products.forEach((prod) => {
        knex(ListProducts.table_name)
          .where(formatReferenceFieldUUId(Lists), listUUID)
          .where(formatReferenceFieldUUId(Products), prod.uuid)
          .limit(1)
          .delete()
          .catch((error) => {
            console.error(error);
          });
      });
    }
  }
}
