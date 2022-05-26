import { ILoggerRepository } from "../../data/protocols/loggerRepository.interface"
import { IController } from "../../presentation/protocols/controller.interface"
import { IHttpRequest, IHttpResponse } from "../../presentation/protocols/http.interface"

export class ControllerWithLoggerDecorator implements IController {
    constructor(
        private readonly controller: IController,
        private readonly loggerRepository: ILoggerRepository
    ) {}
    
    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const httpResponse = await this.controller.handle(httpRequest)

        if (httpResponse.statusCode === 500) {
            await this.loggerRepository.log(httpResponse.body.stack)
        }

        return httpResponse
    }
}
