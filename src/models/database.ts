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

export type Entity<T> = {
  // Model name
  name: string;

  // Table name
  tableName: string;

  // Application-level column names
  column: SchemaMapping<T>;

  // Database-level column names
  mapping: SchemaMapping<T>;

  // Select columns
  selectColumsRef: Ref;

  // References
  reference?: Array<Entity<DatabaseTable>>;

  // JSON columns
  json?: string[];

  // Allowed columns in API transactions
  allowed: Array<string | undefined>;
};

export interface DatabaseTable {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}
