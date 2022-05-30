import { SignUpController } from "./SignUp";
import { IAddAccount, IAddAccountModel } from "../../../domain/useCases/AddAccount.usecase"; 
import { AccountModel } from "../../../domain/models/Account.model";

import { IHttpRequest } from "../../protocols/Http.interface";
import { IValidation } from "../../protocols/Validation.interface";

import { badRequest, ok, serverError } from "../../helpers/http/httpHelper";
import { MissingParamsError, ServerError } from '../../errors/index'

interface SutTypes {
  sut: SignUpController,
  addAccountStub: IAddAccount,
  validationStub: IValidation,
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

const makeSUT = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(
    addAccountStub, 
    validationStub,
  )

  return {
    sut,
    addAccountStub,
    validationStub,
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

  test("Should return 200 if valid data is provided", async () => {
    const { sut } = makeSUT()

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok(makeFakeAccount()));
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
});
