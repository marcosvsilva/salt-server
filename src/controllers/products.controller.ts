import { Request, Response } from 'express';

import knex from '../database';
import Products from '../database/entitites/products';
import { baseCreate, baseIndex, baseRemove, baseShow, baseUpdate } from './application.controller';

const selectColumns = [
  knex.ref(Products.mapping.uuid).as(Products.column.uuid),
  knex.ref(Products.mapping.name).as(Products.column.name),
  knex.ref(Products.mapping.description).as(Products.column.description),
  knex.ref(Products.mapping.createdAt).as(Products.column.createdAt),
  knex.ref(Products.mapping.updatedAt).as(Products.column.updatedAt),
];

/**
 * @route GET /api/products
 */
export async function index(req: Request, res: Response): Promise<Response> {
  return baseIndex(res, Products, selectColumns);
}

/**
 * @route GET /api/products/:uuid
 * @param {string} uuid
 */
export async function show(req: Request, res: Response): Promise<Response> {
  return baseShow(res, req.params.uuid, Products, selectColumns);
}

/**
 * @route POST /api/products
 */
export async function create(req: Request, res: Response): Promise<Response | void> {
  return baseCreate(res, req.body, Products, selectColumns);
}

/**
 * @route PUT /api/products/:uuid
 * @param {string} uuid
 */
export async function update(req: Request, res: Response): Promise<Response> {
  return baseUpdate(res, req.params.uuid, req.body, Products, selectColumns);
}

/**
 * @route DELETE /api/products/:uuid
 * @param {string} uuid
 */
export async function remove(req: Request, res: Response): Promise<Response | void> {
  return baseRemove(res, req.params.uuid, req.body, Products);
}
