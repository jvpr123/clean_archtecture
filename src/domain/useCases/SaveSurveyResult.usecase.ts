import { SurveyResultModel } from "../models/SurveyResult.model"

export type ISaveSurveyModel = Omit<SurveyResultModel, 'id'>

export interface ISaveSurveyResult {
    save (data: ISaveSurveyModel): Promise<SurveyResultModel | null>
}
