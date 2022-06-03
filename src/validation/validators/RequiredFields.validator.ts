import { MissingParamsError } from "src/presentation/errors";
import { IValidation } from "src/presentation/protocols/validation.interface";

export class RequiredFieldsValidation implements IValidation {
    constructor (private readonly field: string) {}
    
    validate(input: any): Error | undefined {
        if (!input[this.field]) {
            return new MissingParamsError(this.field)
        }
    }
}
