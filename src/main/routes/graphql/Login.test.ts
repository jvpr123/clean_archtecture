import app from '../../config/app'
import request from 'supertest'

import { hash } from "bcryptjs"
import { Collection } from "mongodb"

import { MongoHelper } from "../../../infra/database/mongoDB/helpers/MongoHelper"

let collection: Collection

describe('Login GraphQL', () => {
    beforeAll(async () => {
        await MongoHelper.connect(`${process.env.MONGO_URL}`)
    })

    beforeEach(async () => {
        collection = MongoHelper.getCollection('accounts')
        await collection.deleteMany({})
    })

    afterAll(async () => await MongoHelper.disconnect())

    describe('Login Query', () => {
        const query = `query {
                login (email: "test@email.com", password: "test123") {
                    accessToken,
                }
            }`

        test('Should return an account on valid credentials', async () => {
            await collection.insertOne({
                name: 'Test User',
                email: 'test@email.com',
                password: await hash('test123', 12),
            })

            const result = await request(app)
                .post('/graphql')
                .send({ query })

            expect(result.statusCode).toBe(200)
            expect(result.body.data.login.accessToken).toBeTruthy()
        })
    })
})
