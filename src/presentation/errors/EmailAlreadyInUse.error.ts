export class EmailAlreadyInUseError extends Error {
    constructor() {
        super(`The email provided is already in use`);
        this.name = 'EmailAlreadyInUseError'
    }
}
