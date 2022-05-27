import { InvalidParamsError } from "../../errors";
import { IValidation } from "./validation.interface";

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
