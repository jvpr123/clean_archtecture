import { IHttpRequest, IHttpResponse } from "../protocols/http.interface";
import { IMiddleware } from "../protocols/middleware.interface";

import { forbbiden, ok, serverError } from "../helpers/http/httpHelper";
import { AccessDeniedError } from "../errors";
import { ILoadAccountByToken } from "../../domain/useCases/LoadAccountByToken.usecase";

export class AuthenticationMiddleware implements IMiddleware {
    constructor (
        private readonly loadAccountByToken: ILoadAccountByToken,
        private readonly role?: string,
    ) {}

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const accessToken = httpRequest.headers?.['x-access-token']
            
            if (accessToken) {
                const account = this.role 
                    ? await this.loadAccountByToken.loadAccount(accessToken, this.role)
                    : await this.loadAccountByToken.loadAccount(accessToken)
    
                if (account) {
                    return ok({ accountId: account.id })
                }
            }
    
            return forbbiden(new AccessDeniedError())
        } catch (error: any) {
            return serverError(error)
        }
    }
}
