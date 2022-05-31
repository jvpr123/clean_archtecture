import { IEmailValidator } from "../../protocols/emailValidator.interface"
import { EmailValidation } from "./EmailValidation.validator"

interface SutTypes {
  sut: EmailValidation,
  emailValidatorStub: IEmailValidator,
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSUT = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation(emailValidatorStub, 'email')

  return {
    sut,
    emailValidatorStub,
  }
}

describe("Email Validation", () => {
  test("Should call EmailValidator with correct email", () => {
    const { sut, emailValidatorStub } = makeSUT()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.validate({ email: 'any@email.com'});

    expect(isValidSpy).toHaveBeenCalledWith('any@email.com');
  });

  test("Should throw an error if EmailValidator throws an exception", async () => {
    const { sut, emailValidatorStub } = makeSUT()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.validate).toThrow();
  });
});
