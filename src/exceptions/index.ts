export class MissingParamsException extends Error {
  constructor() {
    super('Required params are missing or empty');
    this.name = 'MissingParamsException';
  }
}

export class MissingReferencesFieldsException extends Error {
  constructor() {
    super('Required reference fields are missing');
    this.name = 'MissingReferencesFieldsException';
  }
}

export class MissingIdException extends Error {
  constructor() {
    super('Required UUid field are missing');
    this.name = 'MissingIdException';
  }
}