import { Category } from '../../models';
import { Entity, SchemaMapping } from '../../models/database';
import knex from '..';

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

const schemaName = 'Category';
const tabName = 'Categories';

const selectColumnsListProducts = [
  knex.ref(categoryMapping.name).as(categoryColumns.name).withSchema(tabName),
  knex.ref(categoryMapping.description).as(categoryColumns.description).withSchema(tabName),
  knex.ref(categoryMapping.status).as(categoryColumns.status).withSchema(tabName),
  knex.ref(categoryMapping.createdAt).as(categoryColumns.createdAt).withSchema(tabName),
  knex.ref(categoryMapping.updatedAt).as(categoryColumns.updatedAt).withSchema(tabName),
];

const Categories: Entity<Category> = {
  name: schemaName,
  tableName: tabName,
  column: categoryColumns,
  mapping: categoryMapping,
  selectColumsRef: selectColumnsListProducts,
  allowed: [categoryColumns.name, categoryColumns.status],
};

export default Categories;
