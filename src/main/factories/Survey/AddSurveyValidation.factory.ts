
import { IValidation } from "src/presentation/protocols/validation.interface";
import { ValidationComposite } from "src/validation/validators/ValidationComposite";

import { RequiredFieldsValidation } from "src/validation/validators/RequiredFields.validator"

export const makeAddSurveyValidation = (): ValidationComposite => {
    const validations: IValidation[] = []
    
    for (const field of ['question', 'answers']) {
        validations.push(new RequiredFieldsValidation(field))
    }
    
    return new ValidationComposite(validations) 
}
