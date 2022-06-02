import { NextFunction, Request, Response } from "express";

import { IHttpRequest, IHttpResponse } from "../../presentation/protocols/http.interface";
import { IMiddleware } from "../../presentation/protocols/middleware.interface";

export const expressMiddlewareAdapter = (middleware: IMiddleware) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const httpRequest: IHttpRequest = { headers: req.headers }
        const httpResponse: IHttpResponse = await middleware.handle(httpRequest)

        if (httpResponse.statusCode === 200) {
            Object.assign(res, httpResponse.body)
            return next()
        }
        
        return res
            .status(httpResponse.statusCode)
            .json({ error: httpResponse.body.message })
    }
}
