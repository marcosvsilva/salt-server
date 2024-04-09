import { Knex } from 'knex';
import { JsonArray, JsonObject, JsonValue } from 'type-fest';

import { Entity } from '../database/entitites/entity';
import { InterfaceModel } from '../models';
import { formatReferenceFieldUUId } from './adapter.helper';

export const isValidUUID = (uuidStr: string): boolean => {
  if (uuidStr.length > 0) {
    const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return pattern.test(uuidStr);
  }
  return false;
};

export const isValidReferenceFields = (
  entity: Entity<InterfaceModel>,
  params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>
): boolean => {
  let missingValues = true;
  if (entity.reference && params) {
    const entities = [...entity.reference] as Entity<InterfaceModel>[];
    entities.forEach((ent) => {
      if (missingValues) {
        const field = formatReferenceFieldUUId(ent) || '';
        missingValues = !isEmpty(params[field] as string);
      }
    });
  }

  return missingValues;
};

export const isEmpty = (
  varX: JsonObject | InterfaceModel | JsonArray | string | number | boolean | undefined
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
