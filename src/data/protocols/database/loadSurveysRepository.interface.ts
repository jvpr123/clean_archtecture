import { SurveyModel } from "src/domain/models/Survey.model";

export interface ILoadSurveysRepository {
    loadAllSurveys (): Promise<SurveyModel[]>
}
