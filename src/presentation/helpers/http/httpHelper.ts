import { ServerError } from 'src/presentation/errors/ServerError.error'
import { Unauthorized } from 'src/presentation/errors/Unauthorized.error'
import { IHttpResponse } from 'src/presentation/protocols/http.interface'

export const ok = (data: any): IHttpResponse => {
    return {
        statusCode: 200,
        body: data,
    }
}

export const noContent = (): IHttpResponse => {
    return {
        statusCode: 204,
        body: null,
    }
}

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

export const forbbiden = (error: Error): IHttpResponse => {
    return {
        statusCode: 403,
        body: error
    }
}

export const serverError = (error: Error): IHttpResponse => {
    return {
        statusCode: 500,
        body: new ServerError(error.stack)
    }
}
