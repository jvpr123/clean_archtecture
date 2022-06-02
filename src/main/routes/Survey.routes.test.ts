import app from '../config/app'
import env from '../config/env'
import request from "supertest"

import MockDate from 'mockdate'
import { MongoHelper } from "../../infra/database/mongoDB/helpers/MongoHelper"
import { IAddAccountModel } from '../../domain/useCases/AddAccount.usecase'
import { Collection } from "mongodb"
import { sign } from 'jsonwebtoken'

const makeFakeData = (): IAddAccountModel => ({
    name: 'any_name',
    email: 'any@email.com',
    password: 'any_password',
})

let surveyCollection: Collection
let accountCollection: Collection


describe('Survey Routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(`${process.env.MONGO_URL}`)
        MockDate.set(new Date())
    })

    beforeEach(async () => {
        surveyCollection = MongoHelper.getCollection('surveys')
        accountCollection = MongoHelper.getCollection('accounts')

        await surveyCollection.deleteMany({})
        await accountCollection.deleteMany({})
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
        MockDate.reset()
    })

    describe('POST /surveys', () => {
        test('Should return 403 on add survey without access-token', async () => {
            await request(app)
                .post('/api/surveys')
                .send({
                    question: 'any_question',
                    answers: [
                        { image: 'image_url_1', answer: 'answer_1' },
                        { image: 'image_url_2', answer: 'answer_2' },
                    ],
                    date: new Date(),
                })
                .expect(403)
        })

        test('Should return 204 on add survey with valid access-token', async () => {
            const account = await accountCollection.insertOne({ ...makeFakeData(), role: 'admin' })
            const accessToken = sign({ id: account.insertedId }, env.jwtSecret)

            await accountCollection.updateOne(
                { _id: account.insertedId },
                { $set: { accessToken } }
            )

            await request(app)
                .post('/api/surveys')
                .set('x-access-token', accessToken)
                .send({
                    question: 'any_question',
                    answers: [
                        { image: 'image_url_1', answer: 'answer_1' },
                        { image: 'image_url_2', answer: 'answer_2' },
                    ],
                    date: new Date(),
                })
                .expect(204)
        })
    })
})
