import { EmailValidatorAdapter } from "./EmailValidator.adapter"
import validator from 'validator'

jest.mock('validator', () => ({
    isEmail(): boolean {
        return true
    }
}))

const makeSUT = (): EmailValidatorAdapter => {
    return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
    test('Should return false if validator returns false', () => {
        const sut = makeSUT()
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const isValid = sut.isValid('invalid_email.com')

        expect(isValid).toBe(false)
    })

    test('Should return true if validator returns true', () => {
        const sut = makeSUT()
        const isValid = sut.isValid('valid@email.com')

        expect(isValid).toBe(true)
    })

    test('Should call validator with valid email', () => {
        const sut = makeSUT()
        const isEmailSpy = jest.spyOn(validator, 'isEmail')

        sut.isValid('valid@email.com')

        expect(isEmailSpy).toHaveBeenCalledWith('valid@email.com')
    })
})