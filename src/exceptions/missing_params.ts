class MissingParamsException extends Error {
  constructor() {
    super('Required params are missing or empty');
    this.name = 'MissingParamsException';
  }
}

export default MissingParamsException;
