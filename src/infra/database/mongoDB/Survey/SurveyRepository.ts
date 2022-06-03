import { Collection } from "mongodb";
import { IAddSurveyRepository } from "src/data/protocols/database/addSurveyRepository.interface";
import { ILoadSurveysRepository } from "src/data/protocols/database/loadSurveysRepository.interface";
import { SurveyModel } from "src/domain/models/Survey.model";
import { IAddSurveyModel } from "src/domain/useCases/AddSurvey.usecase";

import { MongoHelper } from "../helpers/MongoHelper";
import { mapArrayCollection } from "../helpers/CollectionMapper";

export class SurveyMongoRepository implements 
    IAddSurveyRepository, 
    ILoadSurveysRepository {
        async add (surveyData: IAddSurveyModel): Promise<void> {
            const surveyCollection = MongoHelper.getCollection('surveys')
            await surveyCollection.insertOne(surveyData)
        }
        
        async loadAllSurveys(): Promise<SurveyModel[]> {
            const surveyCollection = MongoHelper.getCollection('surveys')
            const surveys = await surveyCollection.find().toArray()
            return mapArrayCollection(surveys)
        }
}
