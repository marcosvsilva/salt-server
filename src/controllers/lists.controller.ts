import { Request, Response } from 'express';
import { JsonObject } from 'type-fest';

import knex from '../database';
import ListProducts from '../database/entitites/list_products';
import Lists from '../database/entitites/lists';
import Products from '../database/entitites/products';
import { List } from '../database/models';
import { StatusListProduct } from '../database/models/list_product';
import {
  InvalidUUIDException,
  MissingParamsException,
  MissingReferencesFieldsException,
} from '../exceptions';
import { formatReferenceFieldUUId, isEmpty, isValidUUID } from '../utils';
import { baseIndex, baseRemove, baseUpdate } from './application.controller';
import { create as databaseCreate, getByID as databaseShow } from './database.controller';
import { getAllByList as getAllProductsByList } from './products.controller';
import { getByList as getProductByList } from './users.controller';

/**
 * @route GET /api/lists
 */
export async function index(req: Request, res: Response): Promise<Response> {
  return baseIndex(res, Lists);
}

/**
 * @route GET /api/lists/:uuid
 * @param {string} uuid
 */
export async function show(req: Request, res: Response): Promise<Response> {
  try {
    const list = await databaseShow(Lists, req.params.uuid);

    if (!isEmpty(list)) {
      const products = await getAllProductsByList((list as List).uuid);
      if (products) {
        (list as List).products = products;
      }

      const user = await getProductByList((list as List).uuid);
      if (user) {
        (list as List).user = user;
      }

      return res.status(200).json(list).end();
    }
    return res.status(404).end();
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
    const list = await databaseCreate(Lists, req.body);

    if (list) {
      const linked = await linkProducts((list as List).uuid, req.body.products as string[]);
      if (linked) {
        return res.status(201).json(list).end();
      }
    }
    return res.status(400).end();
  } catch (error) {
    if (
      error instanceof MissingParamsException ||
      error instanceof MissingReferencesFieldsException ||
      error instanceof InvalidUUIDException
    ) {
      return res.status(400).json(error.message).end();
    }
    console.error(error);
    return res.status(500).end();
  }
}

/**
 * @route PUT /api/lists/:uuid
 * @param {string} uuid
 */
export async function update(req: Request, res: Response): Promise<Response> {
  try {
    const updatedProducts = await updateProductsList(req.params.uuid, req.body.products);
    if (updatedProducts) {
      return await baseUpdate(res, req.params.uuid, req.body, Lists);
    }
    return res.status(400).end();
  } catch (error) {
    if (error instanceof InvalidUUIDException) {
      return res.status(400).json(error.message).end();
    }
    console.log(error);
    return res.status(500).end();
  }
}

/**
 * @route DELETE /api/lists/:uuid
 * @param {string} uuid
 */
export async function remove(req: Request, res: Response): Promise<Response | void> {
  try {
    const removed = await removeProductsList(req.params.uuid);
    if (removed) {
      return await baseRemove(res, req.params.uuid, Lists);
    }
    return res.status(400).end();
  } catch (error) {
    if (error instanceof InvalidUUIDException) {
      return res.status(400).json(error.message).end();
    }
    console.error(error);
    return res.status(500).end();
  }
}

async function updateProductsList(listUUID: string, products: string[]): Promise<boolean> {
  if (!isValidUUID(listUUID)) {
    throw new InvalidUUIDException();
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
    throw new InvalidUUIDException();
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

      const listProduct = await databaseCreate(ListProducts, form);
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
    throw new InvalidUUIDException();
  }

  const products = await getAllProductsByList(listUUID);

  let result = true;
  products.forEach((prod) => {
    if (result) {
      knex(ListProducts.tableName)
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
