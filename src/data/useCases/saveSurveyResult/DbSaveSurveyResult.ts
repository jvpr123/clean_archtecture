import { SurveyResultModel } from "src/domain/models/SurveyResult.model";

import { ISaveSurveyResultRepository } from "src/data/protocols/database/saveSurveyResult.interface";
import { ISaveSurveyModel, ISaveSurveyResult } from "src/domain/useCases/SaveSurveyResult.usecase";

export class DbSaveSurveyResult implements ISaveSurveyResult {
    constructor (
        private readonly saveSurveyResultRepossitory: ISaveSurveyResultRepository,
    ) {}

    async save(data: ISaveSurveyModel): Promise<SurveyResultModel | null> {
        const surveyResult = await this.saveSurveyResultRepossitory.save(data)

        return surveyResult
    }
}
