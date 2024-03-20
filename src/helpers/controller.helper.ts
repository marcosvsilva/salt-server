import { Request } from 'express';
import { Knex } from 'knex';
import { JsonObject, JsonValue } from 'type-fest';

import { InvalidUUIDException, MissingParamsException } from '../exceptions';
import { isValidUUID } from './validation.helper';

export const getUUID = (req: Request): string => {
  const param = getParam(req);

  if (!param || param.uuid || !isValidUUID(param.uuid as string)) {
    throw new InvalidUUIDException();
  }

  return req.params.uuid;
};

export const getParam = (
  req: Request
): JsonObject | Record<string, JsonValue | Knex.Raw | undefined> => {
  if (!req.params) {
    throw new MissingParamsException();
  }

  return req.params;
};
