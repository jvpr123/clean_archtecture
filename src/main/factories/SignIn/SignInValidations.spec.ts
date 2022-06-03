import { ValidationComposite } from 'src/validation/validators/ValidationComposite'
import { makeSignInValidation } from './SignInValidation.factory'

import { IValidation } from 'src/presentation/protocols/validation.interface'
import { IEmailValidator } from 'src/validation/protocols/emailValidator.interface'

import { RequiredFieldsValidation } from 'src/validation/validators/RequiredFields.validator'
import { EmailValidation } from 'src/validation/validators/EmailValidation.validator'

jest.mock('src/validation/validators/ValidationComposite')

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
