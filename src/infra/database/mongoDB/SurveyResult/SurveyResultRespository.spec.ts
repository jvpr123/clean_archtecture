import { Collection } from 'mongodb'

import { AccountModel } from 'src/domain/models/Account.model'
import { SurveyModel } from 'src/domain/models/Survey.model'
import { SurveyResultMongoRepository } from './SurveyResultRepository'

import { MongoHelper } from '../helpers/MongoHelper'
import { map } from '../helpers/CollectionMapper'
import { SurveyResultModel } from 'src/domain/models/SurveyResult.model'

const makeSUT = (): SurveyResultMongoRepository => {
    return new SurveyResultMongoRepository()
}

const makeFakeSurvey = async (): Promise<SurveyModel> => {
    const fakeSurvey = {
        question: 'any_question',
        answers: [{ image: 'any_image', answer: 'any_answer' }],
    }

    const result = await surveysCollection.insertOne(fakeSurvey)
    const survey = await surveysCollection.findOne({ _id: result.insertedId })

    return map(survey)
}

const makeFakeAccount = async (): Promise<AccountModel> => {
    const fakeAccount = {
        name: 'any_name',
        email: 'any@email.com',
        password: 'any_password',
    }

    const result = await accountsCollection.insertOne(fakeAccount)
    const account = await accountsCollection.findOne({ _id: result.insertedId })

    return map(account)
}

const makeFakeSurveyResult = async (survey: SurveyModel, account: AccountModel): Promise<SurveyResultModel>  => {
    const result = await surveyResultsCollection.insertOne({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
    })

    const fakeSurveyResult = await surveyResultsCollection.findOne({ _id: result.insertedId })

    return map(fakeSurveyResult)
}

let surveysCollection: Collection
let surveyResultsCollection: Collection
let accountsCollection: Collection

describe('Survey Results MongoDB Repository', () => {
    beforeAll(async () => await MongoHelper.connect(`${process.env.MONGO_URL}`))

    beforeEach(async () => {
        surveysCollection = MongoHelper.getCollection('surveys')
        surveyResultsCollection = MongoHelper.getCollection('surveyResults')
        accountsCollection = MongoHelper.getCollection('accounts')

        await surveysCollection.deleteMany({})
        await surveyResultsCollection.deleteMany({})
        await accountsCollection.deleteMany({})
    })

    afterAll(async () => await MongoHelper.disconnect())

    describe('save()', () => {
        test('Should save a survey result if it is new', async () => {
            const sut = makeSUT()    
            const survey = await makeFakeSurvey()
            const account = await makeFakeAccount()
            const surveyResult = await sut.save({
                surveyId: survey.id,
                accountId: account.id,
                answer: survey.answers[0].answer,
            })
    
            expect(surveyResult).toBeTruthy()
            expect(surveyResult.id).toBeTruthy()
            expect(surveyResult.answer).toEqual(survey.answers[0].answer)
        })

        test('Should update a survey result if it already exists', async () => {
            const sut = makeSUT()    

            const survey = await makeFakeSurvey()
            const account = await makeFakeAccount()
            const previousSurveyResult = await makeFakeSurveyResult(survey, account)
            
            const surveyResult = await sut.save({
                surveyId: survey.id,
                accountId: account.id,
                answer: 'updated_answer',
            })

            console.log(previousSurveyResult)
            console.log(surveyResult)

            expect(surveyResult).toBeTruthy()
            expect(surveyResult.id).toEqual(previousSurveyResult.id)
            expect(surveyResult.answer).toEqual('updated_answer')
        })
    })
})
