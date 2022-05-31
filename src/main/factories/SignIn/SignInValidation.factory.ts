
import { IValidation } from "../../../presentation/protocols/validation.interface";
import { ValidationComposite } from "../../../validation/validators/ValidationComposite";

import { RequiredFieldsValidation } from "../../../validation/validators/RequiredFields.validator";
import { EmailValidation } from "../../../validation/validators/EmailValidation.validator";
import { EmailValidatorAdapter } from "../../../infra/validators/EmailValidator.adapter";

export const makeSignInValidation = (): ValidationComposite => {
    const validations: IValidation[] = [
        new EmailValidation(new EmailValidatorAdapter(), 'email'),
    ]
    
    for (const field of ['email', 'password']) {
        validations.push(new RequiredFieldsValidation(field))
    }
    
    return new ValidationComposite(validations) 
}
