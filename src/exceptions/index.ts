export class MissingRequestBodyException extends Error {
    constructor() {
        super('Request body is missing or empty');
        this.name = 'MissingRequestBodyException';
    }
}

export class MissingFieldsException extends Error {
    constructor() {
        super('Required fields are missing');
        this.name = 'MissingFieldsException';
    }
}
