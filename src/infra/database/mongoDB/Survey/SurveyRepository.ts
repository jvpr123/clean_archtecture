import { IAddSurveyRepository } from "src/data/protocols/database/addSurveyRepository.interface";
import { ILoadSurveysRepository } from "src/data/protocols/database/loadSurveysRepository.interface";
import { ILoadSurveyByIdRepository } from "src/data/protocols/database/loadSurveyById.interface";

import { SurveyModel } from "src/domain/models/Survey.model";
import { IAddSurveyModel } from "src/domain/useCases/AddSurvey.usecase";

import { MongoHelper } from "../helpers/MongoHelper";
import { map, mapArrayCollection } from "../helpers/CollectionMapper";

export class SurveyMongoRepository implements 
    IAddSurveyRepository, 
    ILoadSurveysRepository,
    ILoadSurveyByIdRepository {
        async add (surveyData: IAddSurveyModel): Promise<void> {
            const surveyCollection = MongoHelper.getCollection('surveys')
            await surveyCollection.insertOne(surveyData)
        }
        
        async loadAllSurveys(): Promise<SurveyModel[]> {
            const surveyCollection = MongoHelper.getCollection('surveys')
            const surveys = await surveyCollection.find().toArray()
            return mapArrayCollection(surveys)
        }
        
        async loadById(id: string): Promise<SurveyModel> {
            const surveyCollection = MongoHelper.getCollection('surveys')
            const survey = await surveyCollection.findOne({ _id: id })
            
            return map(survey)
        }
}
