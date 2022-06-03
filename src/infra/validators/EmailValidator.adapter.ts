import { IEmailValidator } from 'src/validation/protocols/emailValidator.interface'
import validator from 'validator'

export class EmailValidatorAdapter implements IEmailValidator {
    isValid(email: string): boolean {
        return validator.isEmail(email)
    }
}
