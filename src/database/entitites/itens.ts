import { Item } from '../../models';
import { Entity, SchemaMapping } from '../../models/database';
import knex from '..';
import Prices from './prices';

const itemColumns: SchemaMapping<Item> = {
  id: 'id',
  uuid: 'uuid',
  description: 'status',
  brand: 'brand',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const itemMapping: SchemaMapping<Item> = {
  id: 'id',
  uuid: 'uuid',
  description: 'description',
  brand: 'brand',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const schemaName = 'Item';
const tabName = 'Itens';

const selectColumnsListProducts = [
  knex.ref(itemMapping.description).as(itemColumns.description).withSchema(tabName),
  knex.ref(itemMapping.brand).as(itemColumns.brand).withSchema(tabName),
  knex.ref(itemMapping.status).as(itemColumns.status).withSchema(tabName),
  knex.ref(itemMapping.createdAt).as(itemColumns.createdAt).withSchema(tabName),
  knex.ref(itemMapping.updatedAt).as(itemColumns.updatedAt).withSchema(tabName),
];

const Itens: Entity<Item> = {
  name: schemaName,
  tableName: tabName,
  column: itemColumns,
  mapping: itemMapping,
  selectColumsRef: selectColumnsListProducts,
  reference: [Prices],
  allowed: [itemColumns.brand, itemColumns.status],
};

export default Itens;
