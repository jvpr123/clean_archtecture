import { HttpResponse } from '../protocols/http.interface'

export const badRequest = (error: Error): HttpResponse => {
    return {
        statusCode: 400,
        body: error
    }
}