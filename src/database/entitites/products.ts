import { DatabaseTable, Entity, SchemaMapping } from './database';

export interface Product extends DatabaseTable {
  name: string;
  description: string;

  //database
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

const productColumns: SchemaMapping<Product> = {
  id: 'id',
  uuid: 'uuid',
  name: 'name',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const productMapping: SchemaMapping<Product> = {
  id: 'id',
  uuid: 'uuid',
  name: 'name',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const Products: Entity<Product> = {
  name: 'Product',
  table_name: 'Products',
  column: productColumns,
  mapping: productMapping,
  allowed: [productColumns.name, productColumns.description],
};

export default Products;
