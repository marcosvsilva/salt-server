import { Request, Response } from 'express';

import knex from '../database';
import Prices from '../database/entitites/prices';
import Products from '../database/entitites/products';
import { InvalidUUIDException } from '../exceptions';
import { deserialize, formatReferenceFieldUUId, isValidUUID } from '../helpers';
import { Price } from '../models';
import { baseCreate, baseIndex, baseRemove, baseShow, baseUpdate } from './application.controller';

/**
 * @route GET /api/prices
 */
export async function index(req: Request, res: Response): Promise<Response> {
  return baseIndex(res, Prices);
}

/**
 * @route GET /api/prices/:uuid
 * @param {string} uuid
 */
export async function show(req: Request, res: Response): Promise<Response> {
  return baseShow(res, req.params.uuid, Prices);
}

/**
 * @route POST /api/prices
 */
export async function create(req: Request, res: Response): Promise<Response> {
  return baseCreate(res, req.body, Prices);
}

/**
 * @route PUT /api/prices/:uuid
 * @param {string} uuid
 */
export async function update(req: Request, res: Response): Promise<Response> {
  return baseUpdate(res, req.params.uuid, req.body, Prices);
}

/**
 * @route DELETE /api/prices/:uuid
 * @param {string} uuid
 */
export async function remove(req: Request, res: Response): Promise<Response> {
  return baseRemove(res, req.params.uuid, Prices);
}

export async function getAllByProduct(product_uuid: string): Promise<Price[]> {
  if (!isValidUUID(product_uuid)) {
    throw new InvalidUUIDException();
  }

  return knex
    .select(Prices.selectColumsRef)
    .from(Prices.tableName)
    .leftJoin(
      Products.tableName,
      `${Prices.tableName}.${formatReferenceFieldUUId(Products)}`,
      `${Products.tableName}.${Products.mapping.uuid}`
    )
    .where(`${Products.tableName}.${Products.mapping.uuid}`, product_uuid)
    .orderBy(`${Prices.tableName}.${Prices.mapping.date}`, 'desc')
    .then((entries) => {
      const files = deserialize(entries, Products);
      if (Array.isArray(files)) {
        return files as Price[];
      }
      return [files] as Price[];
    })
    .catch((error: Error) => {
      throw error;
    });
}
