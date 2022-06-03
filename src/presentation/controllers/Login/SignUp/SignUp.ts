import { IHttpRequest, IHttpResponse } from 'src/presentation/protocols/http.interface'
import { IController } from 'src/presentation/protocols/controller.interface'
import { IValidation } from 'src/presentation/protocols/validation.interface';

import { badRequest, serverError, ok, forbbiden } from 'src/presentation/helpers/http/httpHelper'
import { EmailAlreadyInUseError } from 'src/presentation/errors';

import { IAddAccount } from 'src/domain/useCases/AddAccount.usecase';
import { IAuthentication } from 'src/domain/useCases/Authentication.usecase';

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
