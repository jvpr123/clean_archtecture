export class InvalidParamsError extends Error {
    constructor(param: string) {
        super(`Invalid param: ${param}`);
        this.name = 'InvalidParamsError'
    }
}
