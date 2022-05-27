import { ServerError } from '../errors/ServerError.error'
import { Unauthorized } from '../errors/Unauthorized.error'
import { IHttpResponse } from '../protocols/http.interface'

export const badRequest = (error: Error): IHttpResponse => {
    return {
        statusCode: 400,
        body: error
    }
}

export const unauthorized = (): IHttpResponse => {
    return {
        statusCode: 401,
        body: new Unauthorized()
    }
}

export const serverError = (error: Error): IHttpResponse => {
    return {
        statusCode: 500,
        body: new ServerError(error.stack)
    }
}

export const ok = (data: any): IHttpResponse => {
    return {
        statusCode: 200,
        body: data,
    }
}

