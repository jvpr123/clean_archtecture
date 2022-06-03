import { ISaveSurveyResultRepository } from "src/data/protocols/database/saveSurveyResult.interface";

import { SurveyResultModel } from "src/domain/models/SurveyResult.model";
import { ISaveSurveyModel } from "src/domain/useCases/SaveSurveyResult.usecase";

import { map } from "../helpers/CollectionMapper";
import { MongoHelper } from "../helpers/MongoHelper";

export class SurveyResultMongoRepository implements ISaveSurveyResultRepository {
    async save(data: ISaveSurveyModel): Promise<SurveyResultModel> {
        const surveyResultsCollection = MongoHelper.getCollection('surveyResults')
        const result = await surveyResultsCollection.findOneAndUpdate(
            { surveyId: data.surveyId, accountId: data.accountId },
            { $set: { answer: data.answer } },
            { upsert: true, returnDocument: 'after' },
        )

        return map(result.value)
    }
}