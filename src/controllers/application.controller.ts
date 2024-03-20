import { Request, Response } from 'express';

import {
  InvalidUUIDException,
  MissingParamsException,
  MissingReferencesFieldsException,
} from '../exceptions';
import { getParam, getUUID, isEmpty, isValidUUID } from '../helpers';
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
   * index
   */
  index = async (req: Request, res: Response): Promise<Response> => {
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
   * show
   */
  show = async (req: Request, res: Response): Promise<Response> => {
    try {
      const uuid = getUUID(req);

      if (!isValidUUID(uuid)) {
        throw new InvalidUUIDException();
      }

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
   * create
   */
  create = async (req: Request, res: Response): Promise<Response> => {
    const params = getParam(req);

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
   * update
   */
  update = async (req: Request, res: Response): Promise<Response> => {
    const uuid = getUUID(req);
    const params = getParam(req);

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
   * delete
   */
  delete = async (req: Request, res: Response): Promise<Response> => {
    const uuid = getUUID(req);

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
