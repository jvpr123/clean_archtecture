import { IAddSurveyRepository } from "../../../../data/protocols/database/addSurveyRepository.interface";
import { IAddSurveyModel } from "../../../../domain/useCases/AddSurvey.usecase";

import { MongoHelper } from "../helpers/MongoHelper";

export class SurveyMongoRepository implements IAddSurveyRepository {
    async add (surveyData: IAddSurveyModel): Promise<void> {
        const surveyCollection = MongoHelper.getCollection('surveys')
        
        await surveyCollection.insertOne(surveyData)
    }
}
