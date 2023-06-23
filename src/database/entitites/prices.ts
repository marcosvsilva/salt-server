import knex from '..';
import { DatabaseTable, Entity, SchemaMapping } from './database';
import Products from './products';

export interface Price extends DatabaseTable {
  date: Date;
  price: number;

  // database
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;

  // references
  prices?: Price[];
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

const schemaName = 'Price';
const tabName = 'Prices';

const selectColumnsPrices = [
  knex.ref(priceMapping.uuid).as(priceColumns.uuid).withSchema(tabName),
  knex.ref(priceMapping.date).as(priceColumns.date).withSchema(tabName),
  knex.ref(priceMapping.price).as(priceColumns.price).withSchema(tabName),
  knex.ref(priceMapping.createdAt).as(priceColumns.createdAt).withSchema(tabName),
  knex.ref(priceMapping.updatedAt).as(priceColumns.updatedAt).withSchema(tabName),
];

const Prices: Entity<Price> = {
  name: schemaName,
  tableName: tabName,
  column: priceColumns,
  mapping: priceMapping,
  selectColumsRef: selectColumnsPrices,
  reference: [Products],
  allowed: [priceColumns.date, priceColumns.price],
};

export default Prices;
