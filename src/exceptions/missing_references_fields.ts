export class MissingReferencesFieldsException extends Error {
  constructor() {
    super('Required reference fields are missing');
    this.name = 'MissingReferencesFieldsException';
  }
}

export default MissingReferencesFieldsException;
