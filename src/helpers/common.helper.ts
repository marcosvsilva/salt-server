import { JsonArray, JsonObject } from 'type-fest';

import { DatabaseTable, Entity } from '../models/database';

export function isEmpty(
  varX: JsonObject | DatabaseTable | JsonArray | string | number | boolean | undefined
): boolean {
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
}

export function formatReferenceFieldUUId(entity: Entity<DatabaseTable>): string {
  return `${entity.tableName.toLowerCase()}_${entity.mapping.uuid.toLowerCase()}`;
}
