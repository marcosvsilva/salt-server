import { Knex } from 'knex';

export type SchemaMapping<T> = {
  [Name in keyof T]: string;
};

export type Ref = Knex.Ref<
  string,
  {
    [x: string]: string;
  }
>[];

export type ForeignKey = {
  attribute: string;
  references: string;
  table: string;
};

export type Entity<T> = {
  // Model name
  name: string;

  // Table name
  tableName: string;

  // Application-level attributes names
  column: SchemaMapping<T>;

  // Database-level attributes names
  mapping: SchemaMapping<T>;

  // Foreign keys
  foreignKeys?: ForeignKey[];

  // Select attributes
  selectColumsRef: Ref;

  // JSON attributes
  json?: string[];

  // Allowed columns in API transactions
  allowed: Array<string | undefined>;
};

export default Entity;
