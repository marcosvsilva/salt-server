import { Request, Response } from 'express';
import { Knex } from 'knex';
import { JsonObject, JsonValue } from 'type-fest';

export interface InterfaceController {
  index(req: Request): Promise<Response>;

  show(res: Response, uuid: string): Promise<Response>;

  create(
    res: Response,
    params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>
  ): Promise<Response>;

  update(
    res: Response,
    uuid: string,
    params: JsonObject | Record<string, JsonValue | Knex.Raw | undefined>
  ): Promise<Response>;

  delete(res: Response, uuid: string): Promise<Response>;
}

export default InterfaceController;
