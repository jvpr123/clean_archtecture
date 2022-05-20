import { IHttpResponse } from '../protocols/http.interface'

export const badRequest = (error: Error): IHttpResponse => {
    return {
        statusCode: 400,
        body: error
    }
}