import { Request, Response } from 'express';

import { InvalidUUIDException } from '../exceptions';
import { deserialize, formatReferenceFieldUUId, isEmpty, isValidUUID } from '../helpers';
import knex from '../repository';
import ListProducts from '../repository/entitites/list_products';
import Lists from '../repository/entitites/lists';
import Products from '../repository/entitites/products';
import { Product } from '../repository/models';
import { baseCreate, baseIndex, baseRemove, baseUpdate } from './application.controller';
import { getByID as databaseShow } from './database.controller';
import { getAllByProduct as getAllPricesByProduct } from './prices.controller';

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
  try {
    const product = await databaseShow(Products, req.params.uuid);

    if (!isEmpty(product)) {
      const prices = await getAllPricesByProduct((product as Product).uuid);
      if (prices) {
        (product as Product).prices = prices;
      }

      return res.status(200).json(product).end();
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
      `${Products.tableName}.${Products.mapping.uuid}`
    )
    .where(`${ListProducts.tableName}.${formatReferenceFieldUUId(Lists)}`, list_uuid)
    .then(async (entries) => {
      const files = deserialize(entries, Products);
      if (Array.isArray(files)) {
        const products = files as Product[];
        return Promise.all(
          products.map(async (product) => {
            const tmProduct = product;
            const prices = await getAllPricesByProduct(tmProduct.uuid);
            if (prices) {
              tmProduct.prices = prices;
            }
            return tmProduct;
          })
        );
      }
      const prices = await getAllPricesByProduct((files as Product).uuid);
      if (prices) {
        (files as Product).prices = prices;
      }
      return [files] as Product[];
    })
    .catch((error: Error) => {
      throw error;
    });
}
