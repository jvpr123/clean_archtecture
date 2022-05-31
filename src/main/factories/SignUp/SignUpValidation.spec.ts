import { ValidationComposite } from '../../../validation/validators/ValidationComposite'
import { makeSignUpValidation } from './SignUpValidation.factory'

import { IValidation } from '../../../presentation/protocols/validation.interface'
import { IEmailValidator } from '../../../validation/protocols/emailValidator.interface'

import { RequiredFieldsValidation } from '../../../validation/validators/RequiredFields.validator'
import { CompareFieldsValidation } from '../../../validation/validators/CompareFields.validator'
import { EmailValidation } from '../../../validation/validators/EmailValidation.validator'

jest.mock('../../../validation/validators/ValidationComposite')

const makeEmailValidator = (): IEmailValidator => {
    class EmailValidatorStub implements IEmailValidator {
      isValid(email: string): boolean {
        return true
      }
    }
  
    return new EmailValidatorStub()
  }  

describe('SignUp Validation Factory', () => {
    test('Should call ValidationComposite with all validators', () => {
        const validations: IValidation[] = [
            new CompareFieldsValidation('password', 'passwordConfirmation'),
            new EmailValidation(makeEmailValidator(), 'email'),
        ]

        for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
            validations.push(new RequiredFieldsValidation(field))
        }
        
        makeSignUpValidation()
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})
