import { IHttpRequest, IHttpResponse } from './Http.interface'

export interface IController {
    handle(httpRequest: IHttpRequest): Promise<IHttpResponse>
}
