import { IHttpRequest, IHttpResponse } from '../../protocols/http.interface'
import { IController } from '../../protocols/controller.interface'

import { badRequest, serverError, ok } from '../../helpers/http/httpHelper'
import { IAddAccount } from '../../../domain/useCases/AddAccount.usecase';
import { IValidation } from '../../protocols/validation.interface';

export class SignUpController implements IController {
  constructor(
    private readonly addAccount: IAddAccount,
    private readonly validation: IValidation,
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

      return ok(account)
    } catch(error: any) {
      return serverError(error)
    }
  }
}
