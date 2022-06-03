
import { IValidation } from "src/presentation/protocols/validation.interface";
import { ValidationComposite } from "src/validation/validators/ValidationComposite";

import { RequiredFieldsValidation } from "src/validation/validators/RequiredFields.validator";
import { EmailValidation } from "src/validation/validators/EmailValidation.validator";
import { EmailValidatorAdapter } from "src/infra/validators/EmailValidator.adapter";

export const makeSignInValidation = (): ValidationComposite => {
    const validations: IValidation[] = [
        new EmailValidation(new EmailValidatorAdapter(), 'email'),
    ]
    
    for (const field of ['email', 'password']) {
        validations.push(new RequiredFieldsValidation(field))
    }
    
    return new ValidationComposite(validations) 
}
