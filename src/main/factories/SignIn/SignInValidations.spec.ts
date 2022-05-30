import { ValidationComposite } from '../../../presentation/helpers/validators/ValidationComposite'
import { makeSignInValidation } from './SignInValidation.factory'

import { IValidation } from '../../../presentation/protocols/Validation.interface'
import { IEmailValidator } from '../../../presentation/protocols/EmailValidator.interface'

import { RequiredFieldsValidation } from '../../../presentation/helpers/validators/RequiredFields.validator'
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
