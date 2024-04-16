import { JsonArray, JsonObject } from 'type-fest';

import { InterfaceModel } from '../models';

export const isValidUUID = (uuidStr: string): boolean => {
  if (uuidStr.length > 0) {
    const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return pattern.test(uuidStr);
  }
  return false;
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

export const isNumeric = (strNumeric: string): boolean => {
  return !strNumeric && !parseFloat(strNumeric);
};
