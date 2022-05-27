import { IValidation } from "../../../presentation/protocols/validation.interface";
import { ValidationComposite } from "../../../presentation/helpers/validators/ValidationComposite";

import { CompareFieldsValidation } from "../../../presentation/helpers/validators/CompareFields.validator";
import { RequiredFieldsValidation } from "../../../presentation/helpers/validators/RequiredFields.validator";
import { EmailValidation } from "../../../presentation/helpers/validators/EmailValidation.validator";
import { EmailValidatorAdapter } from "../../../utils/EmailValidator.adapter";

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
