import { Request, Response } from "express";
import { IController } from "../../presentation/protocols/controller.interface";
import { IHttpRequest, IHttpResponse } from "../../presentation/protocols/http.interface";

export const expressRouteAdapter = (controller: IController) => {
    return async (req: Request, res: Response) => {
        const httpRequest: IHttpRequest = { body: req.body }
        const httpResponse: IHttpResponse = await controller.handle(httpRequest)

        return res.status(httpResponse.statusCode).json(httpResponse.body)
    }
}