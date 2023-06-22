export const MESSAGE_REFERENCES_FIELDS = 'Required reference fields are missing';

export class MissingReferencesFieldsException extends Error {
  constructor() {
    super(MESSAGE_REFERENCES_FIELDS);
    this.name = 'MissingReferencesFieldsException';
  }
}

export default MissingReferencesFieldsException;
