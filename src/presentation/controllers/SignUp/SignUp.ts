import { IHttpRequest, IHttpResponse } from '../../protocols/http.interface'
import { IController } from '../../protocols/controller.interface'
import { IEmailValidator } from '../../protocols/emailValidator.interface'

import { badRequest, serverError, ok } from '../../helpers/httpHelper'
import { MissingParamsError, InvalidParamsError } from '../../errors/index';
import { IAddAccount } from '../../../domain/useCases/AddAccount.usecase';

export class SignUpController implements IController {
  constructor(
    private readonly emailValidator: IEmailValidator,
    private readonly addAccount: IAddAccount
  ) {

  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      const { name, email, password, passwordConfirmation } = httpRequest.body
    
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamsError(field));
        }
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamsError('passwordConfirmation'))
      }
    
      const isEmailValid = this.emailValidator.isValid(email)
    
      if (!isEmailValid) {
        return badRequest(new InvalidParamsError('email'))
      }

      const account = await this.addAccount.add({ name, email, password })

      return ok(account)
    } catch(error: any) {
      return serverError(error)
    }
  }
}
