import { IHttpRequest, IHttpResponse } from './http.interface'

export interface IMiddleware {
    handle(httpRequest: IHttpRequest): Promise<IHttpResponse>
}
