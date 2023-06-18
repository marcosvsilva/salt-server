class MissingIdException extends Error {
  constructor() {
    super('Required UUid field are missing');
    this.name = 'MissingIdException';
  }
}

export default MissingIdException;
