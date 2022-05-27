
import { IValidation } from "../../../presentation/protocols/validation.interface";
import { ValidationComposite } from "../../../presentation/helpers/validators/ValidationComposite";

import { RequiredFieldsValidation } from "../../../presentation/helpers/validators/RequiredFields.validator";
import { EmailValidation } from "../../../presentation/helpers/validators/EmailValidation.validator";
import { EmailValidatorAdapter } from "../../../utils/EmailValidator.adapter";

export const makeSignInValidation = (): ValidationComposite => {
    const validations: IValidation[] = [
        new EmailValidation(new EmailValidatorAdapter(), 'email'),
    ]
    
    for (const field of ['email', 'password']) {
        validations.push(new RequiredFieldsValidation(field))
    }
    
    return new ValidationComposite(validations) 
}
