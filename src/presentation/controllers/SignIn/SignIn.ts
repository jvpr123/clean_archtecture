import { IController } from "../../protocols/controller.interface";
import { IHttpRequest, IHttpResponse } from "../../protocols/http.interface";
import { IEmailValidator } from "../../protocols/emailValidator.interface";
import { IAuthentication } from "../../../domain/useCases/Authentication.usecase";

import { badRequest, ok, serverError, unauthorized } from "../../helpers/httpHelper";
import { InvalidParamsError, MissingParamsError } from "../../errors";

export class SignInController implements IController {
    constructor(
        private readonly emailValidator: IEmailValidator,
        private readonly authenticator: IAuthentication,
    ) {}

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const requiredFields = ['email', 'password']
            const { email, password } = httpRequest.body
            
            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamsError(field))
                }
            }
    
            if (!this.emailValidator.isValid(email)) {
                return badRequest(new InvalidParamsError('email'))
            }

            const token = await this.authenticator.auth(email, password)

            if (!token) {
                return unauthorized()
            }
    
            return ok({ token })
        } catch (error: any) {
            return serverError(error)
        }
    }
}