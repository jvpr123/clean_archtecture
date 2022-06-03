import { SurveyModel } from "src/domain/models/Survey.model";

export interface ILoadSurveyByIdRepository {
    loadById (id: string): Promise<SurveyModel>
}
