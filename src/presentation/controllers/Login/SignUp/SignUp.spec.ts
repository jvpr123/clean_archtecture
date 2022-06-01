import { SignUpController } from "./SignUp";
import { IAddAccount, IAddAccountModel } from "../../../../domain/useCases/AddAccount.usecase"; 
import { IAuthentication, IAuthenticationModel } from "../../../../domain/useCases/Authentication.usecase";
import { AccountModel } from "../../../../domain/models/Account.model";

import { IHttpRequest } from "../../../protocols/http.interface";
import { IValidation } from "../../../protocols/validation.interface";

import { badRequest, forbbiden, ok, serverError } from "../../../helpers/http/httpHelper";
import { EmailAlreadyInUseError, MissingParamsError, ServerError } from '../../../errors/index'

interface SutTypes {
  sut: SignUpController,
  addAccountStub: IAddAccount,
  validationStub: IValidation,
  authenticationStub: IAuthentication,
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(input: any): Error | undefined {
      return undefined
    }
  }

  return new ValidationStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: "valid@email.com",
  password: "valid_password",
})

const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async add(account: IAddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountStub()
}

const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
      async auth(authentication: IAuthenticationModel): Promise<string> {
          return 'access_token'
      }
  }

  return new AuthenticationStub()
}

const makeSUT = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const sut = new SignUpController(
    addAccountStub, 
    validationStub,
    authenticationStub,
  )

  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

const makeFakeRequest = (): IHttpRequest => ({
    body: {
      name: 'any_name',
      email: "any@email.com",
      password: "any_password",
      passwordConfirmation: "any_password",
    },
  })

describe("SignUp Controller", () => {
  test("Should call AddAccount with correct values", async () => {
    const { sut, addAccountStub } = makeSUT()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(makeFakeRequest());

    expect(addSpy).toHaveBeenCalledWith({
        name: 'any_name',
        email: "any@email.com",
        password: "any_password",
      });
  });

  test("Should return 500 if AddAccount throws an exception", async () => {
    const { sut, addAccountStub } = makeSUT()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test("Should return 403 if AddAccount returns null", async () => {
    const { sut, addAccountStub } = makeSUT()

    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise(resolve => resolve(null)))

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(forbbiden(new EmailAlreadyInUseError()));
  });

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
  
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSUT()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    
    await sut.handle(makeFakeRequest())
    
    expect(authSpy).toBeCalledWith({
      email: "any@email.com",
      password: "any_password",
    })
  })
  
  test('Should return 500 if Authentication throws an error', async () => {
    const { sut, authenticationStub } = makeSUT()
    jest
    .spyOn(authenticationStub, 'auth')
    .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    
    const httpResponse = await sut.handle(makeFakeRequest())
    
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test("Should return 200 if valid data is provided", async () => {
    const { sut } = makeSUT()
    const httpResponse = await sut.handle(makeFakeRequest());
  
    expect(httpResponse).toEqual(ok({ accessToken: 'access_token' }));
  });
});
