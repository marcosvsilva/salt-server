export const MESSAGE_INVALID_UUID = 'Required UUid field are missing or invalid';

export class InvalidUUIDException extends Error {
  constructor() {
    super(MESSAGE_INVALID_UUID);
    this.name = 'InvalidUUIDException';
  }
}

export default InvalidUUIDException;
