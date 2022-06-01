import app from '../config/app'
import request from "supertest"

import { MongoHelper } from "../../infra/database/mongoDB/helpers/MongoHelper"
import { Collection } from "mongodb"
import { hash } from "bcrypt"

let collection: Collection

describe('Survey Routes', () => {
    beforeAll(async () => await MongoHelper.connect(`${process.env.MONGO_URL}`))

    beforeEach(async () => {
        collection = MongoHelper.getCollection('surveys')
        await collection.deleteMany({})
    })

    afterAll(async () => await MongoHelper.disconnect())

    describe('POST /surveys', () => {
        test('Should return 204 on add survey success', async () => {
            await request(app)
                .post('/api/surveys')
                .send({
                    question: 'any_question',
                    answers: [
                        { image: 'image_url_1', answer: 'answer_1' },
                        { image: 'image_url_2', answer: 'answer_2' },
                    ],
                })
                .expect(204)
        })
    })
})
