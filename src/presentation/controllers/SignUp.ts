import { HttpRequest, HttpResponse } from '../protocols/http.interface'
import { Controller } from '../protocols/controller.interface'
import { badRequest } from '../helpers/httpHelper'
import { MissingParamsError } from '../errors/MissingParams.error';

export class SignUpController implements Controller {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamsError(field));
      }
    }

    return {
      statusCode: 400,
      body: new Error("")
    }
  }
}
