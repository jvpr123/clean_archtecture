import { ValidationComposite } from '../../../validation/validators/ValidationComposite'
import { makeSignInValidation } from './SignInValidation.factory'

import { IValidation } from '../../../presentation/protocols/validation.interface'
import { IEmailValidator } from '../../../validation/protocols/emailValidator.interface'

import { RequiredFieldsValidation } from '../../../validation/validators/RequiredFields.validator'
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

describe('Signin Validation Factory', () => {
    test('Should call ValidationComposite with all validators', () => {
        const validations: IValidation[] = [
            new EmailValidation(makeEmailValidator(), 'email'),
        ]

        for (const field of ['email', 'password']) {
            validations.push(new RequiredFieldsValidation(field))
        }
        
        makeSignInValidation()
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})
