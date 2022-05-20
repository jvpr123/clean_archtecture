import { SignUpController } from "./SignUp";
import { MissingParamsError } from '../errors/MissingParams.error'
import { InvalidParamsError } from '../errors/InvalidParams.error'
import { IEmailValidator } from "../protocols/emailValidator.interface";

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: IEmailValidator
}

const makeSUT = (): SutTypes => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe("SignUp Controller", () => {
  test("Should return 400 name is not provided", () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        email: "anyemail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamsError('name'));
  });

  test("Should return 400 if email is not provided", () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamsError('email'));
  });

  test("Should return 400 if password is not provided", () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: "any@email.com",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamsError('password'));
  });

    test("Should return 400 if password confirmation is not provided", () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: "any@email.com",
        password: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamsError('passwordConfirmation'));
  });

    test("Should return 400 if invalid email format is provided", () => {
    const { sut, emailValidatorStub } = makeSUT()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any_name',
        email: "any@email.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamsError('email'));
  });
});
