import { InvalidParamsError } from "src/presentation/errors";
import { IValidation } from "src/presentation/protocols/validation.interface";

export class CompareFieldsValidation implements IValidation {
    constructor (
        private readonly field: string,
        private readonly fieldToCompare: string,
    ) {}
    
    validate(input: any): Error | undefined {
        if (input[this.field] !== input[this.fieldToCompare]) {
            return new InvalidParamsError(this.fieldToCompare)
        }
    }
}
