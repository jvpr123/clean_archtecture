import { IHttpRequest, IHttpResponse } from '../../protocols/http.interface'
import { IController } from '../../protocols/controller.interface'
import { IValidation } from '../../protocols/validation.interface';

import { badRequest, serverError, ok, forbbiden } from '../../helpers/http/httpHelper'

import { IAddAccount } from '../../../domain/useCases/AddAccount.usecase';
import { IAuthentication } from '../../../domain/useCases/Authentication.usecase';
import { EmailAlreadyInUseError } from '../../errors';

export class SignUpController implements IController {
  constructor(
    private readonly addAccount: IAddAccount,
    private readonly validation: IValidation,
    private readonly authentication: IAuthentication,
  ) {

  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }
      
      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({ name, email, password })

      if (!account) {
        return forbbiden(new EmailAlreadyInUseError())
      }
      
      const accessToken = await this.authentication.auth({ email, password })

      return ok({ accessToken})
    } catch(error: any) {
      return serverError(error)
    }
  }
}
