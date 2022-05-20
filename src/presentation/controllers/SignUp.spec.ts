import { SignUpController } from "./SignUp";
import { MissingParamsError } from '../errors/MissingParams.error'

const makeSUT = () => {
  return new SignUpController()
}

describe("SignUp Controller", () => {
  test("Should return 400 name is not provided", () => {
    const sut = makeSUT()

    const httpRequest = {
      body: {
        email: "anyemail.com",
        password: "any_password",
        passwordConfirmarion: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamsError('name'));
  });

  test("Should return 400 if email is not provided", () => {
    const sut = makeSUT()

    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        passwordConfirmarion: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamsError('email'));
  });

  test("Should return 400 if password is not provided", () => {
    const sut = makeSUT()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: "any@email.com",
        passwordConfirmarion: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamsError('password'));
  });

    test("Should return 400 if password confirmation is not provided", () => {
    const sut = makeSUT()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: "any@email.com",
        password: "any_password",
        passwordConfirmarion: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamsError('passwordConfirmation'));
  });
});
