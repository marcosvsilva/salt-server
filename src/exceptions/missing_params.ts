export const MESSAGE_MISSING_PARAMS = 'Required params are missing or empty';

export class MissingParamsException extends Error {
  constructor() {
    super(MESSAGE_MISSING_PARAMS);
    this.name = 'MissingParamsException';
  }
}

export default MissingParamsException;
