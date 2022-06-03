import { IController } from "src/presentation/protocols/controller.interface";
import { IHttpRequest, IHttpResponse } from "src/presentation/protocols/http.interface";
import { IValidation } from "src/presentation/protocols/validation.interface";
import { IAddSurvey } from "src/domain/useCases/AddSurvey.usecase";

import { badRequest, noContent, serverError } from "src/presentation/helpers/http/httpHelper";

export class AddSurveyController implements IController {
    constructor (
        private readonly validation: IValidation,
        private readonly addSurvey: IAddSurvey,
    ) {}

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)
    
            if (error) {
                return badRequest(error)
            }
    
            const { question, answers } = httpRequest.body
    
            await this.addSurvey.add({
                question,
                answers,
            })
    
            return noContent()
        } catch (error: any) {
            return serverError(error)
        }
    }
}
