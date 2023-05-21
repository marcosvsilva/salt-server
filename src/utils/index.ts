import { DatabaseTable, Entity } from '../database/entitites/database';
import { Knex } from 'knex';
import { JsonArray, JsonObject, JsonValue } from 'type-fest';
import uuidv6 from 'uuid-with-v6';
import knex from '../database';

function processKeys(
  object: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
  entity: Entity<DatabaseTable>,
): JsonObject | Record<string, JsonValue | Knex.Raw | undefined> {
  return Object.keys(object)
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

export const uuidToId = async (
  entity: Entity<DatabaseTable>,
  uuid: string,
): Promise<number | null> => {
  return knex
    .select(entity.mapping.id)
    .from(entity.mapping)
    .where(entity.mapping.uuid, uuid)
    .limit(1)
    .first()
    .then((data: Record<string, number>) => {
      if (data) {
        return data[entity.mapping.id];
      }
      return null;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
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

export const uuidToObject = async (
  entity: Entity<DatabaseTable>,
  uuid: string,
): Promise<JsonObject | null> => {
  const selectColumns = Object.keys(entity.mapping).map((key) =>
    knex.ref(entity.mapping[key]).as(entity.column[key]),
  );
  return knex
    .select(selectColumns)
    .from(entity.table_name)
    .where(entity.mapping.uuid, uuid)
    .limit(1)
    .first()
    .then((item) => {
      if (item) {
        return deserialize(item, entity) as unknown as JsonObject;
      }
      return null;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
};

export const isEmpty = (
  varX: JsonObject | JsonArray | string | number | boolean | undefined,
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

export function capitalize(word: string): string {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

export function getEnumByValue<T extends string | number>(
  enumObject: { [x: string]: T },
  value: T,
): string {
  return Object.keys(enumObject).find((key) => enumObject[key] === value) || '';
}
