import knex from '..';
import { DatabaseTable, Entity, SchemaMapping } from './database';
import Products from './products';

export interface Price extends DatabaseTable {
  date: Date;
  price: number;

  //database
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

const priceColumns: SchemaMapping<Price> = {
  id: 'id',
  uuid: 'uuid',
  date: 'date',
  price: 'price',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const priceMapping: SchemaMapping<Price> = {
  id: 'id',
  uuid: 'uuid',
  date: 'date',
  price: 'price',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const Prices: Entity<Price> = {
  name: 'Price',
  table_name: 'Prices',
  column: priceColumns,
  mapping: priceMapping,
  reference: [Products],
  allowed: [priceColumns.date, priceColumns.price],
};

export const selectColumnsPrices = [
  knex.ref(Prices.mapping.uuid).as(Prices.column.uuid),
  knex.ref(Prices.mapping.date).as(Prices.column.date),
  knex.ref(Prices.mapping.price).as(Prices.column.price),
  knex.ref(Prices.mapping.createdAt).as(Prices.column.createdAt),
  knex.ref(Prices.mapping.updatedAt).as(Prices.column.updatedAt),
];

export default Prices;
