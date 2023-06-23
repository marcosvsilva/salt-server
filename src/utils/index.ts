import { Knex } from 'knex';
import { JsonArray, JsonObject, JsonValue } from 'type-fest';
import uuidv6 from 'uuid-with-v6';

import knex from '../database';
import { DatabaseTable, Entity } from '../database/entitites/database';

export function formatReferenceFieldUUId(entity: Entity<DatabaseTable>): string {
  return `${entity.tableName.toLowerCase()}_${entity.mapping.uuid.toLowerCase()}`;
}

function processKeys(
  _object: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
  entity: Entity<DatabaseTable>,
): JsonObject | Record<string, JsonValue | Knex.Raw | undefined> {
  let object = { ..._object };

  object = Object.keys(_object)
    .filter((key) => entity.allowed.includes(key))
    .reduce((acc, key) => {
      let value: JsonValue | Knex.Raw | Buffer | undefined;

      if (typeof object[key] === 'object') {
        if (knex.client.config.client === 'oracledb') {
          value = Buffer.from(JSON.stringify(object[key] as string), 'utf-8');
        } else {
          value = JSON.stringify(object[key]);
        }
      } else {
        value = object[key];
      }

      acc[entity.mapping[key]] = value;

      return acc;
    }, {});

  // References
  if (entity.reference && _object) {
    entity.reference.forEach((ent) => {
      const field = formatReferenceFieldUUId(ent);
      object[formatReferenceFieldUUId(ent)] = _object[field];
    });
  }

  return object;
}

export const filterParams = (
  object: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
  entity: Entity<DatabaseTable>,
): JsonObject | Record<string, JsonValue | Knex.Raw | undefined> => {
  return processKeys(object, entity);
};

export const addIdentifiers = (
  _object: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
  entity: Entity<DatabaseTable>,
  defaultUuid: string | undefined = undefined,
): JsonObject | Record<string, JsonValue | Knex.Raw | undefined> => {
  const object = { ..._object };

  if (knex.client.config.client === 'oracledb' && entity.mapping.id) {
    object[entity.mapping?.id] = knex.raw('??.NEXTVAL', [entity.mapping.id]);
  }

  if (entity.mapping.uuid) {
    if (defaultUuid) {
      object[entity.mapping.uuid] = defaultUuid;
    } else {
      object[entity.mapping.uuid] = uuidv6.v6();
    }
  }

  return object;
};

export const addTimestamps = (
  _object: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
  entity: Entity<DatabaseTable>,
  method: 'create' | 'update' = 'update',
): JsonObject | Record<string, JsonValue | Knex.Raw | undefined> => {
  const object = { ..._object };
  if (method === 'create' && 'createdAt' in entity.mapping) {
    object[entity.mapping.createdAt] = knex.fn.now();
  }

  if ('updatedAt' in entity.mapping && entity.mapping.updatedAt) {
    object[entity.mapping.updatedAt] = knex.fn.now();
  }

  return object;
};

export function cast(entry: DatabaseTable, entity: Entity<DatabaseTable>): DatabaseTable {
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
}

export const deserialize = (
  _data: DatabaseTable | DatabaseTable[],
  entity: Entity<DatabaseTable>,
): DatabaseTable | DatabaseTable[] => {
  if (Array.isArray(_data)) {
    return _data.map((entry) => cast(entry, entity));
  }
  if (typeof _data === 'object') {
    return cast(_data, entity);
  }
  return _data;
};

export const isEmpty = (
  varX: JsonObject | DatabaseTable | JsonArray | string | number | boolean | undefined,
): boolean => {
  const undef = undefined;
  const emptyValues = [undef, null, false, 0, '', '0', 'undefined'];

  for (const val of emptyValues) {
    if (varX === val) {
      return true;
    }
  }

  if (typeof varX === 'object') {
    return !Object.keys(varX).length;
  }

  return false;
};

export function getEnumByValue<T extends string | number>(
  enumObject: { [x: string]: T },
  value: T,
): string {
  return Object.keys(enumObject).find((key) => enumObject[key] === value) || '';
}

export function isValidUUID(uuidStr: string): boolean {
  if (uuidStr.length > 0) {
    const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return pattern.test(uuidStr);
  }
  return false;
}
