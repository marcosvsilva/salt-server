import { Request, Response } from 'express';

export interface InterfaceController {
  /**
   * index
   */
  index(req: Request, res: Response): Promise<Response>;

  /**
   * show
   */
  show(req: Request, res: Response): Promise<Response>;

  /**
   * create
   */
  create(req: Request, res: Response): Promise<Response>;

  /**
   * update
   */
  update(req: Request, res: Response): Promise<Response>;

  /**
   * delete
   */
  delete(req: Request, res: Response): Promise<Response>;
}

export default InterfaceController;
