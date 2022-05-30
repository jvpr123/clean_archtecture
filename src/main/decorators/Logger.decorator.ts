import { ILoggerRepository } from "../../data/protocols/database/LoggerRepository.interface"
import { IController } from "../../presentation/protocols/Controller.interface"
import { IHttpRequest, IHttpResponse } from "../../presentation/protocols/Http.interface"

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
