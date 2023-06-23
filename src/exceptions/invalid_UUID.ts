export class InvalidUUIDException extends Error {
  constructor() {
    super('Required UUid field are missing or invalid');
    this.name = 'InvalidUUIDException';
  }
}

export default InvalidUUIDException;
