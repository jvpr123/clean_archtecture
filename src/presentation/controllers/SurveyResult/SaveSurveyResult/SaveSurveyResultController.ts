import { ILoadSurveyById } from "src/domain/useCases/LoadSurveyById.usecase";
import { ISaveSurveyResult } from "src/domain/useCases/SaveSurveyResult.usecase";

import { InvalidParamsError } from "src/presentation/errors";
import { forbbiden, ok, serverError } from "src/presentation/helpers/http/httpHelper";
import { IController } from "src/presentation/protocols/controller.interface";
import { IHttpRequest, IHttpResponse } from "src/presentation/protocols/http.interface";

export class SaveSurveyResultController implements IController {
    constructor (
        private readonly loadSurveyById: ILoadSurveyById,
        private readonly saveSurveyResult: ISaveSurveyResult,
    ) {}

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const { surveyId } = httpRequest.params
            const { answer } = httpRequest.body
            
            const survey = await this.loadSurveyById.loadById(surveyId)
    
            if (survey) {
                const answers = survey.answers.map(el => el.answer)

                if (!answers.includes(answer)) {
                    return forbbiden(new InvalidParamsError('answer'))
                } 
            } else {
                return forbbiden(new InvalidParamsError('surveyId'))                
            }
    
            const surveyResult = await this.saveSurveyResult.save({
                accountId: httpRequest.accountId!,
                surveyId,
                answer,
            })

            return ok(surveyResult)
        } catch (error: any) {
            return serverError(error)
        }
    }
}
