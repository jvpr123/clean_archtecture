import { IController } from "../../../protocols/controller.interface";
import { IHttpRequest, IHttpResponse } from "../../../protocols/http.interface";
import { IAuthentication } from "../../../../domain/useCases/Authentication.usecase";

import { badRequest, ok, serverError, unauthorized } from "../../../helpers/http/httpHelper";
import { IValidation } from "../../../protocols/validation.interface";

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
