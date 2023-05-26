export class MissingRequestBodyException extends Error {
  constructor() {
    super('Request body is missing or empty');
    this.name = 'MissingRequestBodyException';
  }
}
