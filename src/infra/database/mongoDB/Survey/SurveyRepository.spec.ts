import { Collection } from 'mongodb'
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

let collection: Collection

describe('Survey MongoDB Repository', () => {
    beforeAll(async () => await MongoHelper.connect(`${process.env.MONGO_URL}`))

    beforeEach(async () => {
        collection = MongoHelper.getCollection('surveys')
        await collection.deleteMany({})
    })

    afterAll(async () => await MongoHelper.disconnect())

    test('Should return an account on add success', async () => {
        const sut = makeSUT()
        const fakeData = makeFakeData()

        await sut.add(fakeData)
        const survey = await collection.findOne({ question: fakeData.question })

        expect(survey).toBeTruthy()
    })
})
