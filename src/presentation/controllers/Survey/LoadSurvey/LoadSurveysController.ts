import { IController } from "src/presentation/protocols/controller.interface";
import { IHttpRequest, IHttpResponse } from "src/presentation/protocols/http.interface";
import { ILoadSurveys } from "src/domain/useCases/LoadSurveys.usecase";

import { noContent, ok, serverError } from "src/presentation/helpers/http/httpHelper";

export class LoadSurveysController implements IController {
    constructor (
        private readonly loadSurveys: ILoadSurveys,
    ) {}

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const surveys = await this.loadSurveys.load()
    
            return surveys.length ? ok(surveys) : noContent()
        } catch (error: any) {
            return serverError(error)
        }
    }
}
