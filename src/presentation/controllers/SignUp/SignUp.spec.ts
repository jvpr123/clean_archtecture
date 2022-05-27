import { SignUpController } from "./SignUp";
import { IEmailValidator } from "../../protocols/emailValidator.interface";
import { MissingParamsError, InvalidParamsError, ServerError } from '../../errors/index'
import { IAddAccount, IAddAccountModel } from "../../../domain/useCases/AddAccount.usecase"; 
import { AccountModel } from "../../../domain/models/Account.model";
import { IHttpRequest } from "../../protocols/http.interface";
import { badRequest, ok, serverError } from "../../helpers/httpHelper";

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: IEmailValidator,
  addAccountStub: IAddAccount,
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
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

  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
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
  test("Should return 400 name is not provided", async () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        email: "anyemail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamsError('name')));
  });

  test("Should return 400 if email is not provided", async () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamsError('email')));
  });

  test("Should return 400 if password is not provided", async () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: "any@email.com",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamsError('password')));
  });

  test("Should return 400 if password confirmation is not provided", async () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: "any@email.com",
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamsError('passwordConfirmation')));
  });

  test("Should return 400 if invalid email format is provided", async () => {
    const { sut, emailValidatorStub } = makeSUT()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(badRequest(new InvalidParamsError('email')));
  });

  test("Should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSUT()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(makeFakeRequest());

    expect(isValidSpy).toHaveBeenCalledWith('any@email.com');
  });

  test("Should return 500 if EmailValidator throws an exception", async () => {
    const { sut, emailValidatorStub } = makeSUT()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test("Should return 400 if password confirmation fails", async () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: "any@email.com",
        password: "any_password",
        passwordConfirmation: "other_password",
      },
    }

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamsError('passwordConfirmation')));
  });

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
});
