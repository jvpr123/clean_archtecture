import { IAddSurveyModel } from "../../../domain/useCases/AddSurvey.usecase";

export interface IAddSurveyRepository {
    add (surveyData: IAddSurveyModel): Promise<void>
}
