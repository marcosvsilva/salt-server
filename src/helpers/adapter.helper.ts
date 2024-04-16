import { Knex } from 'knex';
import { JsonObject, JsonValue } from 'type-fest';

import knex from '../database';
import { Entity } from '../database/entitites/entity';
import { InterfaceModel } from '../models';

export const formatReferenceFieldUUId = (entity: Entity<InterfaceModel>): string => {
  return `${entity.tableName.toLowerCase()}_${entity.mapping.uuid.toLowerCase()}`;
};

export const formatParams = (
  object: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
  entity: Entity<InterfaceModel>
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

  return obj;
};
