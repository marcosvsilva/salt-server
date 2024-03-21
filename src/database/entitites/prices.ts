import { Price } from '../../models';
import { Entity, SchemaMapping } from '../../models/database';
import knex from '..';

const priceColumns: SchemaMapping<Price> = {
  id: 'id',
  uuid: 'uuid',
  price: 'price',
  dateStart: 'dateStart',
  dateEnd: 'dateEnd',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const priceMapping: SchemaMapping<Price> = {
  id: 'id',
  uuid: 'uuid',
  price: 'price',
  dateStart: 'dateStart',
  dateEnd: 'dateEnd',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const schemaName = 'Price';
const tabName = 'Prices';

const selectColumnsPrices = [
  knex.ref(priceMapping.price).as(priceColumns.price).withSchema(tabName),
  knex.ref(priceMapping.dateStart).as(priceColumns.dateStart).withSchema(tabName),
  knex.ref(priceMapping.dateEnd).as(priceColumns.dateEnd).withSchema(tabName),
  knex.ref(priceMapping.createdAt).as(priceColumns.createdAt).withSchema(tabName),
  knex.ref(priceMapping.updatedAt).as(priceColumns.updatedAt).withSchema(tabName),
];

const Prices: Entity<Price> = {
  name: schemaName,
  tableName: tabName,
  column: priceColumns,
  mapping: priceMapping,
  selectColumsRef: selectColumnsPrices,
  allowed: [priceColumns.dateStart, priceColumns.dateEnd],
};

export default Prices;
