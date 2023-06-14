import { Request, Response } from 'express';
import { JsonObject } from 'type-fest';

import knex from '../database';
import ListProducts from '../database/entitites/list_products';
import Lists, { StatusList } from '../database/entitites/lists';
import Products from '../database/entitites/products';
import { formatReferenceFieldUUId, isEmpty } from '../utils';
import { baseCreate, baseIndex, baseRemove, baseShow, baseUpdate } from './application.controller';

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
  // if (req.body) {
  //   let resCreateLists: JsonObject = {};
  //   await baseCreate(req.body, res, Lists, selectColumns, resCreateLists, false, true);

  //   if (!isEmpty(resCreateLists)) {
  //     const valueListUUID = resCreateLists.body ? resCreateLists.body['uuid'] : '';

  //     await Array.from(req.body['products']).map(async (prod) => {
  //       const form: JsonObject = {
  //         [formatReferenceFieldUUId(Lists)]: valueListUUID,
  //         [formatReferenceFieldUUId(Products)]: prod as string,
  //         date: new Date().toJSON(),
  //         status: StatusList.Create,
  //       };
  //       console.log(form);

  //       const resCreateProduct: JsonObject = {};
  //       await baseCreate(form, res, ListProducts, selectColumnsListProducts, resCreateProduct, false, true);
  //       if (!isEmpty(resCreateProduct)) {
  //         console.log(`product ${prod as string} link on list ${valueListUUID}`)
  //       }
  //       else {
  //         console.error(`error link product: ${prod as string} in list ${valueListUUID}`)
  //       }
  //       console.log('pass final loop');

  //       return res.statusCode(201).json(resCreateLists);
  //     });

  //     return res.sendStatus(205).json(resJson);
  //   } else {
  //     return res.sendStatus(500).end()
  //   }
  // }
  // return res.sendStatus(400).end();
  return baseCreate(res, req.body, Lists, selectColumns);
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
