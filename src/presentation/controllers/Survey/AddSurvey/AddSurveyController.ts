import { IAddSurvey } from "../../../../domain/useCases/AddSurvey.usecase";
import { badRequest, noContent, serverError } from "../../../helpers/http/httpHelper";
import { IController } from "../../../protocols/controller.interface";
import { IHttpRequest, IHttpResponse } from "../../../protocols/http.interface";
import { IValidation } from "../../../protocols/validation.interface";

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
