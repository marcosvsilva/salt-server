import { Item } from '../../models';
import knex from '..';
import { Brands } from './brands';
import { Categories } from './categories';
import { Entity, ForeignKey, SchemaMapping } from './entity';

const itemColumns: SchemaMapping<Item> = {
  id: 'id',
  uuid: 'uuid',
  description: 'description',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const itemMapping: SchemaMapping<Item> = {
  id: 'id',
  uuid: 'uuid',
  description: 'description',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const schemaName = 'salt';
const tabName = 'itens';

const selectColumnsListProducts = [
  knex.ref(itemColumns.id).as(itemMapping.id).withSchema(tabName),
  knex.ref(itemColumns.uuid).as(itemMapping.uuid).withSchema(tabName),
  knex.ref(itemColumns.description).as(itemMapping.description).withSchema(tabName),
  knex.ref(itemColumns.status).as(itemMapping.status).withSchema(tabName),
  knex.ref(itemColumns.createdAt).as(itemMapping.createdAt).withSchema(tabName),
  knex.ref(itemColumns.updatedAt).as(itemMapping.updatedAt).withSchema(tabName),
];

export const Itens: Entity<Item> = {
  name: schemaName,
  tableName: tabName,
  column: itemColumns,
  mapping: itemMapping,
  selectColumsRef: selectColumnsListProducts,
  allowed: [itemMapping.status],
};

const itemForeignKeys: ForeignKey[] = [
  {
    attribute: 'brand',
    references: Brands.column.uuid,
    table: Brands.tableName,
  },
  {
    attribute: 'category',
    references: Categories.column.uuid,
    table: Categories.tableName,
  },
];

Itens.foreignKeys = itemForeignKeys;

export default Itens;
