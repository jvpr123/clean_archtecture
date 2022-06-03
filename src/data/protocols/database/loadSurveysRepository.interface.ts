import { SurveyModel } from "../../../domain/models/Survey.model";

export interface ILoadSurveysRepository {
    loadAllSurveys (): Promise<SurveyModel[]>
}
