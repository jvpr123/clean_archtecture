import { IAuthentication } from "../../../domain/useCases/Authentication.usecase"
import { InvalidParamsError, MissingParamsError } from "../../errors"
import { badRequest, ok, serverError, unauthorized } from "../../helpers/httpHelper"
import { IEmailValidator } from "../../protocols/emailValidator.interface"
import { IHttpRequest } from "../../protocols/http.interface"
import { SignInController } from "./SignIn"


interface SutTypes {
    sut: SignInController
    emailValidatorStub: IEmailValidator
    authenticationStub: IAuthentication
}

const makeSUT = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const authenticationStub = makeAuthentication()
    const sut = new SignInController(emailValidatorStub, authenticationStub)
    
    return {
        sut,
        emailValidatorStub,
        authenticationStub,
    }
}

const makeEmailValidator = (): IEmailValidator => {
    class EmailValidatorStub implements IEmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }

    return new EmailValidatorStub()
}

const makeAuthentication = (): IAuthentication => {
    class AuthenticationStub implements IAuthentication {
        async auth(email: string, password: string): Promise<string> {
            return 'access_token'
        }
    }

    return new AuthenticationStub()
}

const makeFakeRequest = (): IHttpRequest => ({
    body: {
        email: 'any@email.com',
        password: 'any_password',
    }
})

describe('Sign In Controller', () => {
    test('Should return 400 if email is not provided', async () => {
        const { sut } = makeSUT()
        const httpResponse = await sut.handle({ body: { password: 'any_password' } })
        
        expect(httpResponse).toEqual(badRequest(new MissingParamsError('email')))
    })

    test('Should return 400 if password is not provided', async () => {
        const { sut } = makeSUT()
        const httpResponse = await sut.handle({ body: { email: 'any@email.com' } })
        
        expect(httpResponse).toEqual(badRequest(new MissingParamsError('password')))
    })

    test('Should return 400 if invalid email format is provided', async () => {
        const { sut, emailValidatorStub } = makeSUT()
        
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpResponse = await sut.handle(makeFakeRequest())
        
        expect(httpResponse).toEqual(badRequest(new InvalidParamsError('email')))
    })
    
    test('Should return 401 if authentication fails', async () => {
        const { sut, authenticationStub } = makeSUT()
        
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve) => resolve(null)))
        const httpResponse = await sut.handle(makeFakeRequest())
        
        expect(httpResponse).toEqual(unauthorized())
    })
    
    test('Should return 200 if authentication succeeds', async () => {
        const { sut } = makeSUT()
        
        const httpResponse = await sut.handle(makeFakeRequest())
        
        expect(httpResponse).toEqual(ok({ token: 'access_token' }))
    })

    test('Should return 500 if EmailValidator throws an error', async () => {
        const { sut, emailValidatorStub } = makeSUT()
        
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })

        const httpResponse = await sut.handle(makeFakeRequest())
        
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should return 500 if Authentication throws an error', async () => {
        const { sut, authenticationStub } = makeSUT()
        
        jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
            throw new Error()
        })

        const httpResponse = await sut.handle(makeFakeRequest())
        
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSUT()
        const fakeRequest = makeFakeRequest()

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        await sut.handle(fakeRequest)
        
        expect(isValidSpy).toHaveBeenCalledWith(fakeRequest.body.email)
    })

    test('Should call Authentication with correct email', async () => {
        const { sut, authenticationStub } = makeSUT()
        const fakeRequest = makeFakeRequest()

        const authSpy = jest.spyOn(authenticationStub, 'auth')
        await sut.handle(fakeRequest)
        
        expect(authSpy).toHaveBeenCalledWith(fakeRequest.body.email, fakeRequest.body.password)
    })
})
