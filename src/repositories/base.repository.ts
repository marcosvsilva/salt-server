import { Knex } from 'knex';
import { JsonObject, JsonValue } from 'type-fest';

import knex from '../database';
import { Entity } from '../database/entitites/entity';
import { InvalidUUIDException, MissingParamsException } from '../exceptions';
import { addIdentifiers, addTimestamps, deserialize, formatParams, isValidUUID } from '../helpers';
import { InterfaceModel } from '../models';
import { InterfaceRepository, Where } from './interface.repository';

export class BaseRepository implements InterfaceRepository {
  private entity: Entity<InterfaceModel>;

  constructor(entity: Entity<InterfaceModel>) {
    this.entity = entity;
  }

  getByID = async (idValue: string): Promise<InterfaceModel> => {
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
        return {} as InterfaceModel;
      })
      .catch((error: Error) => {
        console.log(error);
        throw error;
      });
  };

  getAll = async (where?: Where[]): Promise<InterfaceModel[]> => {
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
        return [files] as InterfaceModel[];
      })
      .catch((error: Error) => {
        throw error;
      });
  };

  create = async (
    params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>
  ): Promise<InterfaceModel> => {
    if (!params) {
      throw new MissingParamsException();
    }

    let newParams = formatParams(params, this.entity);
    newParams = addTimestamps(newParams, this.entity, 'create');
    newParams = addIdentifiers(newParams, this.entity);

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
  ): Promise<InterfaceModel> => {
    if (!isValidUUID(uuid)) {
      throw new InvalidUUIDException();
    }

    if (!params) {
      throw new MissingParamsException();
    }

    let newParams = formatParams(params, this.entity);
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
