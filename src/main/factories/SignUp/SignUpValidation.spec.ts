import { ValidationComposite } from 'src/validation/validators/ValidationComposite'
import { makeSignUpValidation } from './SignUpValidation.factory'

import { IValidation } from 'src/presentation/protocols/validation.interface'
import { IEmailValidator } from 'src/validation/protocols/emailValidator.interface'

import { RequiredFieldsValidation } from 'src/validation/validators/RequiredFields.validator'
import { CompareFieldsValidation } from 'src/validation/validators/CompareFields.validator'
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
