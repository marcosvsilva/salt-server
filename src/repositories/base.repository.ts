import { Knex } from 'knex';
import { JsonObject, JsonValue } from 'type-fest';

import knex from '../database';
import {
  InvalidUUIDException,
  MissingParamsException,
  MissingReferencesFieldsException,
} from '../exceptions';
import {
  addIdentifiers,
  addTimestamps,
  deserialize,
  isValidReferenceFields,
  isValidUUID,
  processParams,
} from '../helpers/repository.helper';
import { DatabaseTable, Entity } from '../models/database';
import { InterfaceRepository, Where } from './interface.repository';

export class BaseRepository implements InterfaceRepository {
  private entity: Entity<DatabaseTable>;

  constructor(entity: Entity<DatabaseTable>) {
    this.entity = entity;
  }

  getByID = async (idValue: string): Promise<DatabaseTable> => {
    if (!isValidUUID(idValue)) {
      throw new InvalidUUIDException();
    }

    return knex
      .select(this.entity.selectColumsRef)
      .from(this.entity.tableName)
      .where(this.entity.mapping.uuid, idValue)
      .limit(1)
      .first()
      .then((entry) => {
        if (entry) {
          const files = deserialize(entry, this.entity);
          if (Array.isArray(files)) {
            return files[0];
          }
          return files;
        }
        return {} as DatabaseTable;
      })
      .catch((error: Error) => {
        console.log(error);
        throw error;
      });
  };

  getAll = async (where?: Where[]): Promise<DatabaseTable[]> => {
    let query = knex.select(this.entity.selectColumsRef).from(this.entity.tableName);

    if (where && where?.length > 0) {
      Array.from(where).forEach((condition) => {
        query = query.where(condition.field, condition.operator, condition.value);
      });
    }

    return query
      .then((entries) => {
        const files = deserialize(entries, this.entity);
        if (Array.isArray(files)) {
          return files;
        }
        return [files] as DatabaseTable[];
      })
      .catch((error: Error) => {
        throw error;
      });
  };

  create = async (
    params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>
  ): Promise<DatabaseTable> => {
    if (!params) {
      throw new MissingParamsException();
    }

    let newParams = processParams(params, this.entity);
    newParams = addTimestamps(newParams, this.entity, 'create');
    newParams = addIdentifiers(newParams, this.entity);

    const checkReferences = isValidReferenceFields(this.entity, params);
    if (!checkReferences) {
      throw new MissingReferencesFieldsException();
    }

    const uuid = params[this.entity.mapping.uuid] as string;
    return knex
      .transaction(async (trx: Knex.Transaction) => {
        return trx
          .insert(newParams)
          .into(this.entity.tableName)
          .limit(1)
          .then(() =>
            trx
              .select(this.entity.selectColumsRef)
              .from(this.entity.tableName)
              .where(this.entity.mapping.uuid, uuid)
              .limit(1)
              .first()
          );
      })
      .then((entry) => {
        const files = deserialize(entry, this.entity);
        if (Array.isArray(files)) {
          return files[0];
        }
        return files;
      })
      .catch((error: Error) => {
        throw error;
      });
  };

  update = async (
    params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>,
    uuid: string
  ): Promise<DatabaseTable> => {
    if (!isValidUUID(uuid)) {
      throw new InvalidUUIDException();
    }

    if (!params) {
      throw new MissingParamsException();
    }

    let newParams = processParams(params, this.entity);
    newParams = addTimestamps(params, this.entity);

    return knex
      .transaction(async (trx: Knex.Transaction) => {
        return trx(this.entity.tableName)
          .update(newParams)
          .where(this.entity.mapping.uuid, uuid)
          .limit(1)
          .then(() =>
            trx
              .select(this.entity.selectColumsRef)
              .from(this.entity.tableName)
              .where(this.entity.mapping.uuid, uuid)
              .limit(1)
              .first()
          );
      })
      .then((entry) => {
        const files = deserialize(entry, this.entity);
        if (Array.isArray(files)) {
          return files[0];
        }
        return files;
      })
      .catch((error: Error) => {
        throw error;
      });
  };

  delete = async (uuid: string): Promise<boolean> => {
    if (!isValidUUID(uuid)) {
      throw new InvalidUUIDException();
    }

    return knex(this.entity.tableName)
      .where(this.entity.mapping.uuid, uuid)
      .limit(1)
      .delete()
      .then((result) => {
        return !!result;
      })
      .catch((error: Error) => {
        throw error;
      });
  };
}

export default BaseRepository;
