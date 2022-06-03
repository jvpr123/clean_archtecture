import { IController } from "src/presentation/protocols/controller.interface";
import { IHttpRequest, IHttpResponse } from "src/presentation/protocols/http.interface";
import { IAuthentication } from "src/domain/useCases/Authentication.usecase";
import { IValidation } from "src/presentation/protocols/validation.interface";

import { badRequest, ok, serverError, unauthorized } from "src/presentation/helpers/http/httpHelper";

export class SignInController implements IController {
    constructor(
        private readonly validation: IValidation,
        private readonly authentication: IAuthentication,
    ) {}

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)

            if (error) {
                return badRequest(error)
            }
            
            const token = await this.authentication.auth(httpRequest.body)

            if (!token) {
                return unauthorized()
            }
    
            return ok({ token })
        } catch (error: any) {
            console.log(error)
            return serverError(error)
        }
    }
}
