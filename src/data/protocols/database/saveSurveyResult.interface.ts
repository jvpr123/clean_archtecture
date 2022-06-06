import { SurveyResultModel } from "src/domain/models/SurveyResult.model";
import { ISaveSurveyModel } from "src/domain/useCases/SaveSurveyResult.usecase";

export interface ISaveSurveyResultRepository {
    save (data: ISaveSurveyModel): Promise<SurveyResultModel>
}
