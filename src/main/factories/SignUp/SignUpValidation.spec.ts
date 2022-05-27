import { ValidationComposite } from '../../../presentation/helpers/validators/ValidationComposite'
import { makeSignUpValidation } from './SignUpValidation.factory'

import { IValidation } from '../../../presentation/protocols/validation.interface'
import { IEmailValidator } from '../../../presentation/protocols/emailValidator.interface'

import { RequiredFieldsValidation } from '../../../presentation/helpers/validators/RequiredFields.validator'
import { CompareFieldsValidation } from '../../../presentation/helpers/validators/CompareFields.validator'
import { EmailValidation } from '../../../presentation/helpers/validators/EmailValidation.validator'

jest.mock('../../../presentation/helpers/validators/ValidationComposite')

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
