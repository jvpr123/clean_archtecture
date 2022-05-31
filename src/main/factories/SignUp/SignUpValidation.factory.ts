import { IValidation } from "../../../presentation/protocols/validation.interface";
import { ValidationComposite } from "../../../validation/validators/ValidationComposite";

import { CompareFieldsValidation } from "../../../validation/validators/CompareFields.validator";
import { RequiredFieldsValidation } from "../../../validation/validators/RequiredFields.validator";
import { EmailValidation } from "../../../validation/validators/EmailValidation.validator";
import { EmailValidatorAdapter } from "../../../infra/validators/EmailValidator.adapter";

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
