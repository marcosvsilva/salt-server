import { Knex } from 'knex';
import { JsonObject, JsonValue } from 'type-fest';
import uuidv6 from 'uuid-with-v6';

import knex from '../database';
import { DatabaseTable, Entity } from '../models/database';

export const cast = (entry: DatabaseTable, entity: Entity<DatabaseTable>): DatabaseTable => {
  return Object.keys(entry).reduce((_obj, key) => {
    const obj = { ..._obj };

    if (entity.json && entity.json.includes(key)) {
      if (typeof entry[key] === 'string') {
        obj[key] = JSON.parse(entry[key]);
      } else if (Buffer.isBuffer(entry[key])) {
        obj[key] = JSON.parse(entry[key].toString());
      } else {
        obj[key] = entry[key];
      }
    } else {
      obj[key] = entry[key];
    }

    return obj;
  }, {}) as DatabaseTable;
};

export const getEnumByValue = <T extends string | number>(
  enumObject: { [x: string]: T },
  value: T
): string => {
  return Object.keys(enumObject).find((key) => enumObject[key] === value) || '';
};

export const addIdentifiers = (
  object: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
  entity: Entity<DatabaseTable>,
  defaultUuid: string | undefined = undefined
): JsonObject | Record<string, JsonValue | Knex.Raw | undefined> => {
  const obj = { ...object };

  if (knex.client.config.client === 'oracledb' && entity.mapping.id) {
    obj[entity.mapping?.id] = knex.raw('??.NEXTVAL', [entity.mapping.id]);
  }

  if (entity.mapping.uuid) {
    if (defaultUuid) {
      obj[entity.mapping.uuid] = defaultUuid;
    } else {
      obj[entity.mapping.uuid] = uuidv6.v6();
    }
  }

  return obj;
};

export const addTimestamps = (
  object: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
  entity: Entity<DatabaseTable>,
  method: 'create' | 'update' = 'update'
): JsonObject | Record<string, JsonValue | Knex.Raw | undefined> => {
  const obj = { ...object };
  if (method === 'create' && 'createdAt' in entity.mapping) {
    obj[entity.mapping.createdAt] = knex.fn.now();
  }

  if ('updatedAt' in entity.mapping && entity.mapping.updatedAt) {
    obj[entity.mapping.updatedAt] = knex.fn.now();
  }

  return obj;
};

export const deserialize = (
  data: DatabaseTable | DatabaseTable[],
  entity: Entity<DatabaseTable>
): DatabaseTable | DatabaseTable[] => {
  if (Array.isArray(data)) {
    return data.map((entry) => cast(entry, entity));
  }
  if (typeof data === 'object') {
    return cast(data, entity);
  }
  return data;
};
