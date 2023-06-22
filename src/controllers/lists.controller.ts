import { Request, Response } from 'express';
import { JsonObject } from 'type-fest';

import knex from '../database';
import ListProducts, {
  selectColumnsListProducts,
  StatusListProduct,
} from '../database/entitites/list_products';
import Lists, { List, selectColumnsLists } from '../database/entitites/lists';
import Products from '../database/entitites/products';
import {
  InvalidUUIDException,
  MissingParamsException,
  MissingReferencesFieldsException,
} from '../exceptions';
import { MESSAGE_INVALID_UUID } from '../exceptions/invalid_UUID';
import { formatReferenceFieldUUId, isEmpty, isValidUUID } from '../utils';
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
      if (lists[indexList]) {
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
    if (req.params && req.params.uuid) {
      const list = await databaseShow(req.params.uuid, selectColumnsLists, Lists);

      if (!isEmpty(list)) {
        const products = await getAllByList((list as List).uuid);

        if (products) {
          (list as List).products = products;
        }

        return res.status(200).json(list).end();
      }
      return res.status(404).end();
    }
    return res.status(400).end();
  } catch (error) {
    if (error instanceof InvalidUUIDException) {
      return res.status(400).message(error.message).end();
    }
    console.log(error);
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
        const linked = await linkProducts((list as List).uuid, req.body.products as string[]);
        if (linked) {
          return res.status(201).json(list).end();
        }
      }
    }
    return res.status(400).end();
  } catch (error) {
    console.error(error);
    if (
      error instanceof MissingParamsException ||
      error instanceof MissingReferencesFieldsException
    ) {
      return res.status(400).json(error.message).end();
    }
    return res.status(500).end();
  }
}

/**
 * @route PUT /api/lists/:uuid
 * @param {string} uuid
 */
export async function update(req: Request, res: Response): Promise<Response> {
  try {
    if (req.params && req.params.uuid) {
      if (req.body && req.body.products) {
        await updateProductsList(req.params.uuid, req.body.products);
      }
      return await baseUpdate(res, req.params.uuid, req.body, Lists, selectColumnsLists);
    }
    return req.status(400).end();
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}

/**
 * @route DELETE /api/lists/:uuid
 * @param {string} uuid
 */
export async function remove(req: Request, res: Response): Promise<Response | void> {
  if (req.params && req.params.uuid) {
    const removed = await removeProductsList(req.params.uuid);
    if (removed) {
      return baseRemove(res, req.params.uuid, Lists);
    }
  }
  return res.status(400).json(MESSAGE_INVALID_UUID).end();
}

async function updateProductsList(listUUID: string, products: string[]): Promise<boolean> {
  if (!isValidUUID(listUUID)) {
    return false;
  }

  let result = true;
  if (products && Array.from(products).length > 0) {
    const clearProducts = await removeProductsList(listUUID);
    if (clearProducts) {
      result = await linkProducts(listUUID, products);
    }
  }

  return result;
}

async function linkProducts(listUUID: string, products: string[]): Promise<boolean> {
  if (!isValidUUID(listUUID)) {
    return false;
  }

  let result = true;
  for (const indexProduct in products) {
    if (products[indexProduct] && result) {
      const form: JsonObject = {
        [formatReferenceFieldUUId(Lists)]: listUUID,
        [formatReferenceFieldUUId(Products)]: products[indexProduct],
        date: new Date().toJSON(),
        status: JSON.stringify(StatusListProduct.Create),
      };

      const listProduct = await databaseCreate(form, ListProducts, selectColumnsListProducts);
      result = !isEmpty(listProduct);
      if (!result) {
        console.error(`Error to link product: ${products[indexProduct]} in ${listUUID} list`);
      }
    }
  }
  return result;
}

async function removeProductsList(listUUID: string): Promise<boolean> {
  if (!isValidUUID(listUUID)) {
    return false;
  }

  const products = await getAllByList(listUUID);

  let result = true;
  products.forEach((prod) => {
    if (result) {
      knex(ListProducts.table_name)
        .where(formatReferenceFieldUUId(Lists), listUUID)
        .where(formatReferenceFieldUUId(Products), prod.uuid)
        .limit(1)
        .delete()
        .then((res) => {
          result = !!res;
        })
        .catch((error) => {
          console.log(error);
          result = false;
        });
    }
  });

  return result;
}
