import { Response } from 'express';
import { Knex } from 'knex';
import { JsonObject, JsonValue } from 'type-fest';

import {
  InvalidUUIDException,
  MissingParamsException,
  MissingReferencesFieldsException,
} from '../exceptions';
import { isEmpty } from '../helpers/common.helper';
import { DatabaseTable, Entity } from '../models/database';
import { BaseRepository } from '../repositories/base.repository';
import { InterfaceRepository } from '../repositories/interface.repository';
import { InterfaceController } from './interface.controller';

export class ApplicationController implements InterfaceController {
  private entity: Entity<DatabaseTable>;

  private repository: InterfaceRepository;

  constructor(entity: Entity<DatabaseTable>) {
    this.entity = entity;
    this.repository = new BaseRepository(this.entity);
  }

  /**
   * Index
   */
  index = async (res: Response): Promise<Response> => {
    try {
      const entries = await this.repository.getAll();
      if (entries) {
        if (Array.isArray(entries) && Array.from(entries).length > 0) {
          return res.status(200).json(entries).end();
        }
        return res.status(200).json({}).end();
      }
      return res.status(400).end();
    } catch (error) {
      console.error(error);
      return res.status(500).end();
    }
  };

  /**
   * Show
   *
   */
  show = async (res: Response, uuid: string): Promise<Response> => {
    try {
      const entry = await this.repository.getByID(uuid);
      if (!isEmpty(entry)) {
        return res.status(200).json(entry).end();
      }
      return res.status(404).end();
    } catch (error) {
      if (error instanceof InvalidUUIDException) {
        return res.status(400).json(error.message).end();
      }
      console.error(error);
      return res.status(500).end();
    }
  };

  /**
   * Create
   *
   */
  create = async (
    res: Response,
    params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>
  ): Promise<Response> => {
    try {
      const data = await this.repository.create(params);
      if (!isEmpty(data)) {
        return res.status(201).json(data).end();
      }
      return res.status(400).end();
    } catch (error) {
      if (
        error instanceof MissingReferencesFieldsException ||
        error instanceof MissingParamsException
      ) {
        return res.status(400).json(error.message).end();
      }
      console.error(error);
      return res.status(500).end();
    }
  };

  /**
   * Update
   *
   */
  update = async (
    res: Response,
    uuid: string,
    params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>
  ): Promise<Response> => {
    try {
      const data = await this.repository.update(params, uuid);
      if (!isEmpty(data)) {
        return res.status(200).json(data).end();
      }
      return res.status(400).end();
    } catch (error) {
      if (error instanceof InvalidUUIDException || error instanceof MissingParamsException) {
        res.status(400).json(error.message).end();
      }
      console.error(error);
      return res.status(500).end();
    }
  };

  /**
   * Delete
   *
   */
  delete = async (res: Response, uuid: string): Promise<Response> => {
    try {
      const removed = await this.repository.delete(uuid);
      if (!isEmpty(removed)) {
        return res.status(204).end();
      }
      return res.status(400).end();
    } catch (error) {
      if (error instanceof InvalidUUIDException) {
        return res.status(400).json(error.message).end();
      }
      console.error(error);
      return res.status(500).end();
    }
  };
}

export default ApplicationController;
