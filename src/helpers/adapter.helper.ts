import { Knex } from 'knex';
import { JsonObject, JsonValue } from 'type-fest';

import knex from '../database';
import { DatabaseTable, Entity } from '../database/entitites/entity';

export const formatReferenceFieldUUId = (entity: Entity<DatabaseTable>): string => {
  return `${entity.tableName.toLowerCase()}_${entity.mapping.uuid.toLowerCase()}`;
};

export const formatParams = (
  object: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
  entity: Entity<DatabaseTable>
): JsonObject | Record<string, JsonValue | Knex.Raw | undefined> => {
  let obj = { ...object };

  obj = Object.keys(object)
    .filter((key) => entity.allowed.includes(key))
    .reduce((acc, key) => {
      let value: JsonValue | Knex.Raw | Buffer | undefined;

      if (typeof obj[key] === 'object') {
        if (knex.client.config.client === 'oracledb') {
          value = Buffer.from(JSON.stringify(obj[key] as string), 'utf-8');
        } else {
          value = JSON.stringify(obj[key]);
        }
      } else {
        value = obj[key];
      }

      acc[entity.mapping[key]] = value;

      return acc;
    }, {});

  // References
  if (entity.reference && object) {
    entity.reference.forEach((ent) => {
      const field = formatReferenceFieldUUId(ent);
      obj[formatReferenceFieldUUId(ent)] = object[field];
    });
  }

  return obj;
};
