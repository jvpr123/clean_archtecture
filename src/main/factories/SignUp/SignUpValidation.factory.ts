import { IValidation } from "src/presentation/protocols/validation.interface";
import { ValidationComposite } from "src/validation/validators/ValidationComposite";

import { CompareFieldsValidation } from "src/validation/validators/CompareFields.validator";
import { RequiredFieldsValidation } from "src/validation/validators/RequiredFields.validator";
import { EmailValidation } from "src/validation/validators/EmailValidation.validator";
import { EmailValidatorAdapter } from "src/infra/validators/EmailValidator.adapter";

export const makeSignUpValidation = (): ValidationComposite => {
    const validations: IValidation[] = [
        new CompareFieldsValidation('password', 'passwordConfirmation'),
        new EmailValidation(new EmailValidatorAdapter(), 'email'),
    ]
    
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
        validations.push(new RequiredFieldsValidation(field))
    }
    
    return new ValidationComposite(validations) 
}
