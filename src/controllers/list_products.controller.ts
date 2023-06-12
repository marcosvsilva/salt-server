import { Request, Response } from 'express';
import { baseCreate, baseIndex, baseRemove, baseShow, baseUpdate } from './application.controller';
import knex from '../database';
import ListProducts, { ListProduct } from '../database/entitites/list_products';

const selectColumns = [
  knex.ref(ListProducts.mapping.uuid).as(ListProducts.column.uuid),
  knex.ref(ListProducts.mapping.status).as(ListProducts.column.status),
  knex.ref(ListProducts.mapping.date).as(ListProducts.column.date),
  knex.ref(ListProducts.mapping.createdAt).as(ListProducts.column.createdAt),
  knex.ref(ListProducts.mapping.updatedAt).as(ListProducts.column.updatedAt),
];

export async function byId(uuID: string): Promise<ListProduct[] | undefined> {
    const listProducts = await knex
        .select(ListProducts.column)
        .from(ListProducts.table_name)
        .catch((error: Error) => {
            console.error(error);
        });
 
    if (listProducts && Array.isArray(listProducts)) {
        return listProducts.map((entrie) => ({
            id: entrie.id,
            userId: entrie.users_uuid,
            date: entrie.date,
            status: entrie.status,
            uuid: entrie.uuid,
            createdAt: entrie.createdAt,
            updatedAt: entrie.updatedAt
        }))
    }
    return undefined;
}

export async function create(req: Request, res: Response): Promise<Response | void> {
  return baseCreate({ req, res, entity: ListProducts, selectColumns, doDeserialize: true });
}

export async function read(req: Request, res: Response): Promise<Response> {
  return baseShow(req, res, ListProducts, selectColumns, true);
}

export async function update(req: Request, res: Response): Promise<Response> {
  return baseUpdate(req, res, ListProducts, selectColumns, true);
}

export async function remove(req: Request, res: Response): Promise<Response | void> {
  return baseRemove(req, res, ListProducts);
}
