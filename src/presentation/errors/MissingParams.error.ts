export class MissingParamsError extends Error {
    constructor(param: string) {
        super(`Missing param: ${param}`);
        this.name = 'MissingParamsError'
    }
}