
import { IValidation } from "../../../presentation/protocols/validation.interface";
import { ValidationComposite } from "../../../validation/validators/ValidationComposite";

import { RequiredFieldsValidation } from "../../../validation/validators/RequiredFields.validator"

export const makeAddSurveyValidation = (): ValidationComposite => {
    const validations: IValidation[] = []
    
    for (const field of ['question', 'answers']) {
        validations.push(new RequiredFieldsValidation(field))
    }
    
    return new ValidationComposite(validations) 
}
