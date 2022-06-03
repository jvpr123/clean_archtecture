import { Collection } from 'mongodb'
import { SurveyModel } from '../../../../domain/models/Survey.model'
import { IAddSurveyModel } from '../../../../domain/useCases/AddSurvey.usecase'
import { MongoHelper } from '../helpers/MongoHelper'
import { SurveyMongoRepository } from './SurveyRepository'

const makeSUT = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
}

const makeFakeData = (): IAddSurveyModel => ({
    question: 'any_question',
    answers: [
        { image: 'any_image', answer: 'any_answer' }
    ],
})

const makeFakeSurveys = (): SurveyModel[] => ([
    {
        id: 'any_id',
        question: 'any_question',
        answers: [{ image: 'any_image', answer: 'any_answer' }],
    },
])

let collection: Collection

describe('Survey MongoDB Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(`${process.env.MONGO_URL}`)
    })

    beforeEach(async () => {
        collection = MongoHelper.getCollection('surveys')
        await collection.deleteMany({})
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    describe('add()', () => {
        test('Should add a survey on success', async () => {
            const sut = makeSUT()
            const fakeData = makeFakeData()
    
            await sut.add(fakeData)
            const survey = await collection.findOne({ question: fakeData.question })
    
            expect(survey).toBeTruthy()
        })
    })

    describe('load()', () => {
        test('Should load all surveys on success', async () => {
            const sut = makeSUT()
            await collection.insertMany(makeFakeSurveys())
            const surveys = await sut.loadAllSurveys()
    
            expect(surveys.length).toBe(1)
        })

        test('Should load an empty list', async () => {
            const sut = makeSUT()
            const surveys = await sut.loadAllSurveys()
    
            expect(surveys.length).toBe(0)
        })
    })
})
