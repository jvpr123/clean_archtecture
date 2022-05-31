import { InvalidParamsError } from "../../presentation/errors";
import { IValidation } from "../../presentation/protocols/validation.interface";

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
