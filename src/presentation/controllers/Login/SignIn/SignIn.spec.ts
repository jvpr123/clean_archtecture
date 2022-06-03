import { SignInController } from "./SignIn"

import { IHttpRequest } from "src/presentation/protocols/http.interface"
import { IAuthentication, IAuthenticationModel } from "src/domain/useCases/Authentication.usecase"

import { IValidation } from "src/presentation/protocols/validation.interface"
import { badRequest, ok, unauthorized } from "src/presentation/helpers/http/httpHelper"
import { MissingParamsError } from "src/presentation/errors"

type SutTypes = {
    sut: SignInController
    validationStub: IValidation
    authenticationStub: IAuthentication
}

const makeValidation = (): IValidation => {
    class ValidationStub implements IValidation {
      validate(input: any): Error | undefined {
        return undefined
      }
    }
  
    return new ValidationStub()
  }

const makeSUT = (): SutTypes => {
    const validationStub = makeValidation()
    const authenticationStub = makeAuthentication()
    const sut = new SignInController(validationStub, authenticationStub)
    
    return {
        sut,
        validationStub,
        authenticationStub,
    }
}

const makeAuthentication = (): IAuthentication => {
    class AuthenticationStub implements IAuthentication {
        async auth(authentication: IAuthenticationModel): Promise<string> {
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
    test('Should call Authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSUT()
        const authSpy = jest.spyOn(authenticationStub, 'auth')

        await sut.handle(makeFakeRequest())

        expect(authSpy).toBeCalledWith(makeFakeRequest().body)
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

    test("Should call Validation with correct values", async () => {
        const { sut, validationStub } = makeSUT()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const fakeRequest = makeFakeRequest()
      
        await sut.handle(fakeRequest);
      
        expect(validateSpy).toHaveBeenCalledWith(fakeRequest.body);
      });
    
      test("Should return 400 if validation throws an error", async () => {
        const { sut, validationStub } = makeSUT()
    
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamsError('any'))
        const httpResponse = await sut.handle(makeFakeRequest());
    
        expect(httpResponse).toEqual(badRequest(new MissingParamsError('any')));
      });
})
