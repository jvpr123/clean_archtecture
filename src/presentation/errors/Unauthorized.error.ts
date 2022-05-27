export class Unauthorized extends Error {
    constructor(stack?: string) {
        super(`Unauthorized`);
        this.name = 'Unauthorized'
        this.stack = stack
    }
}
