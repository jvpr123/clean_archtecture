import app from '../config/app'
import env from '../config/env'
import request from "supertest"

import { MongoHelper } from "src/infra/database/mongoDB/helpers/MongoHelper"
import { IAddAccountModel } from 'src/domain/useCases/AddAccount.usecase'
import { IAddSurveyModel } from 'src/domain/useCases/AddSurvey.usecase'
import { Collection } from "mongodb"
import { sign } from 'jsonwebtoken'

const makeAccountFakeData = (): IAddAccountModel => ({
    name: 'any_name',
    email: 'any@email.com',
    password: 'any_password',
})

const makeAccessToken = async (role?: string): Promise<string> => {
    const account = await accountCollection.insertOne({ ...makeAccountFakeData(), role })
    const accessToken = sign({ id: account.insertedId }, env.jwtSecret)

    await accountCollection.updateOne(
        { _id: account.insertedId },
        { $set: { accessToken } }
    )

    return accessToken
}

const makeFakeSurveyData = (): IAddSurveyModel => ({
    question: 'any_question',
    answers: [
        { image: 'image_url_1', answer: 'answer_1' },
        { image: 'image_url_2', answer: 'answer_2' },
    ],
})

let surveyCollection: Collection
let accountCollection: Collection


describe('Survey Routes', () => {
    beforeAll(async () => await MongoHelper.connect(`${process.env.MONGO_URL}`))

    beforeEach(async () => {
        surveyCollection = MongoHelper.getCollection('surveys')
        accountCollection = MongoHelper.getCollection('accounts')

        await surveyCollection.deleteMany({})
        await accountCollection.deleteMany({})
    })

    afterAll(async () => await MongoHelper.disconnect())

    describe('POST /surveys', () => {
        test('Should return 403 on add survey without access-token', async () => {
            await request(app)
                .post('/api/surveys')
                .send(makeFakeSurveyData())
                .expect(403)
        })

        test('Should return 204 on add survey with valid access-token', async () => {
            const accessToken = await makeAccessToken('admin')

            await request(app)
                .post('/api/surveys')
                .set('x-access-token', accessToken)
                .send(makeFakeSurveyData())
                .expect(204)
        })
    })

    describe('GET /surveys', () => {
        test('Should return 403 on load surveys without access-token', async () => {
            await request(app)
                .get('/api/surveys')
                .expect(403)
        })

        test('Should return 204 on load empty-surveys with valid access-token', async () => {
            const accessToken = await makeAccessToken()

            await request(app)
                .get('/api/surveys')
                .set('x-access-token', accessToken)
                .expect(204)
        })
    })
})
