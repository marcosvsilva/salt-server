import { Price } from '../../models';
import knex from '..';
import { Entity, ForeignKey, SchemaMapping } from './entity';
import Itens from './itens';
import Users from './users';

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

const schemaName = 'Salt';
const tabName = 'Prices';

const selectColumnsPrices = [
  knex.ref(priceColumns.price).as(priceMapping.price).withSchema(tabName),
  knex.ref(priceColumns.dateStart).as(priceMapping.dateStart).withSchema(tabName),
  knex.ref(priceColumns.dateEnd).as(priceMapping.dateEnd).withSchema(tabName),
  knex.ref(priceColumns.createdAt).as(priceMapping.createdAt).withSchema(tabName),
  knex.ref(priceColumns.updatedAt).as(priceMapping.updatedAt).withSchema(tabName),
];

const Prices: Entity<Price> = {
  name: schemaName,
  tableName: tabName,
  column: priceColumns,
  mapping: priceMapping,
  selectColumsRef: selectColumnsPrices,
  allowed: [priceMapping.dateStart, priceMapping.dateEnd],
};

const priceForeignKeys: ForeignKey[] = [
  {
    uuid: 'item',
    references: Itens.column.uuid,
    table: Itens.tableName,
  },
];

Users.foreignKeys = priceForeignKeys;

export default Prices;
