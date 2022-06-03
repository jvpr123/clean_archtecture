import { ValidationComposite } from 'src/validation/validators/ValidationComposite'
import { makeAddSurveyValidation } from './AddSurveyValidation.factory'
import { IValidation } from 'src/presentation/protocols/validation.interface'
import { RequiredFieldsValidation } from 'src/validation/validators/RequiredFields.validator'

jest.mock('src/validation/validators/ValidationComposite')

describe('AddSurvey Validation Factory', () => {
    test('Should call ValidationComposite with all validators', () => {
        const validations: IValidation[] = []

        for (const field of ['question', 'answers']) {
            validations.push(new RequiredFieldsValidation(field))
        }
        
        makeAddSurveyValidation()
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})
