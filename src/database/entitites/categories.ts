import { Category } from '../../models';
import knex from '..';
import { Entity, ForeignKey, SchemaMapping } from './entity';

const categoryColumns: SchemaMapping<Category> = {
  id: 'id',
  uuid: 'uuid',
  name: 'name',
  description: 'description',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const categoryMapping: SchemaMapping<Category> = {
  id: 'id',
  uuid: 'uuid',
  name: 'name',
  description: 'description',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const schemaName = 'Salt';
const tabName = 'Categories';

const selectColumnsListProducts = [
  knex.ref(categoryColumns.id).as(categoryMapping.id).withSchema(tabName),
  knex.ref(categoryColumns.uuid).as(categoryMapping.uuid).withSchema(tabName),
  knex.ref(categoryColumns.name).as(categoryMapping.name).withSchema(tabName),
  knex.ref(categoryColumns.description).as(categoryMapping.description).withSchema(tabName),
  knex.ref(categoryColumns.status).as(categoryMapping.status).withSchema(tabName),
  knex.ref(categoryColumns.createdAt).as(categoryMapping.createdAt).withSchema(tabName),
  knex.ref(categoryColumns.updatedAt).as(categoryMapping.updatedAt).withSchema(tabName),
];

export const Categories: Entity<Category> = {
  name: schemaName,
  tableName: tabName,
  column: categoryColumns,
  mapping: categoryMapping,
  selectColumsRef: selectColumnsListProducts,
  allowed: [categoryMapping.name, categoryMapping.status],
};

const categoryForeignKeys: ForeignKey[] = [
  {
    attribute: 'father',
    references: Categories.column.uuid,
    table: Categories.tableName,
  },
];

Categories.foreignKeys = categoryForeignKeys;

export default Categories;
