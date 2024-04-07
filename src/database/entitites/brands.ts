import { Brand } from '../../models';
import knex from '..';
import { Entity, SchemaMapping } from './entity';

const brandColumns: SchemaMapping<Brand> = {
  id: 'id',
  uuid: 'uuid',
  name: 'name',
  description: 'description',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const brandMapping: SchemaMapping<Brand> = {
  id: 'id',
  uuid: 'uuid',
  name: 'name',
  description: 'description',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const schemaName = 'Salt';
const tabName = 'Brands';

const selectColumnsListProducts = [
  knex.ref(brandColumns.id).as(brandMapping.id).withSchema(tabName),
  knex.ref(brandColumns.uuid).as(brandMapping.uuid).withSchema(tabName),
  knex.ref(brandColumns.name).as(brandMapping.name).withSchema(tabName),
  knex.ref(brandColumns.description).as(brandMapping.description).withSchema(tabName),
  knex.ref(brandColumns.status).as(brandMapping.status).withSchema(tabName),
  knex.ref(brandColumns.createdAt).as(brandMapping.createdAt).withSchema(tabName),
  knex.ref(brandColumns.updatedAt).as(brandMapping.updatedAt).withSchema(tabName),
];

const Brands: Entity<Brand> = {
  name: schemaName,
  tableName: tabName,
  column: brandColumns,
  mapping: brandMapping,
  selectColumsRef: selectColumnsListProducts,
  allowed: [brandMapping.name, brandMapping.status],
};

export default Brands;
