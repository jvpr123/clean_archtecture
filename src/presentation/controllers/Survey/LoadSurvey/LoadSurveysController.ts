import { ILoadSurveys } from "../../../../domain/useCases/LoadSurveys.usecase";
import { noContent, ok, serverError } from "../../../helpers/http/httpHelper";
import { IController } from "../../../protocols/controller.interface";
import { IHttpRequest, IHttpResponse } from "../../../protocols/http.interface";

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
