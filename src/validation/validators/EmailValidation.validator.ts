import { InvalidParamsError } from "src/presentation/errors";
import { IEmailValidator } from "../protocols/emailValidator.interface";
import { IValidation } from "src/presentation/protocols/validation.interface";

export class EmailValidation implements IValidation {
    constructor (
        private readonly emailValidator: IEmailValidator,
        private readonly field: string
    ) {}
    
    validate(input: any): Error | undefined {
        const isEmailValid = this.emailValidator.isValid(input[this.field])
      
        if (!isEmailValid) {
            return new InvalidParamsError(this.field)
        }
    }
}
