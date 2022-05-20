import { IHttpRequest, IHttpResponse } from '../protocols/http.interface'
import { IController } from '../protocols/controller.interface'
import { IEmailValidator } from '../protocols/emailValidator.interface'

import { badRequest } from '../helpers/httpHelper'
import { MissingParamsError } from '../errors/MissingParams.error';
import { InvalidParamsError } from '../errors/InvalidParams.error';

export class SignUpController implements IController {
  constructor(private readonly emailValidator: IEmailValidator) {

  }

  handle(httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamsError(field));
      }
    }

    const isEmailValid = this.emailValidator.isValid(httpRequest.body.email)

    if (!isEmailValid) {
      return badRequest(new InvalidParamsError('email'))
    }

    return {
      statusCode: 400,
      body: new Error("")
    }
  }
}
