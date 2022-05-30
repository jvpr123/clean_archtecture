import app from '../config/app'
import request from "supertest"

import { MongoHelper } from "../../infra/database/mongoDB/helpers/MongoHelper"
import { Collection } from "mongodb"
import { hash } from "bcrypt"

let collection: Collection

describe('Login Routes', () => {
    beforeAll(async () => await MongoHelper.connect(`${process.env.MONGO_URL}`))

    beforeEach(async () => {
        collection = MongoHelper.getCollection('accounts')
        await collection.deleteMany({})
    })

    afterAll(async () => await MongoHelper.disconnect())

    describe('POST /signup', () => {
        test('Should return 200 on signup', async () => {
            await request(app)
                .post('/api/signup')
                .send({
                    name: 'Test User',
                    email: 'test@email.com',
                    password: 'test123',
                    passwordConfirmation: 'test123',
                })
                .expect(200)
        })
    })

    describe('POST /signin', () => {
        test('Should return 200 on login', async () => {
            await collection.insertOne({
                name: 'Test User',
                email: 'test@email.com',
                password: await hash('test123', 12),
            })

            await request(app)
                .post('/api/signin')
                .send({
                    email: 'test@email.com',
                    password: 'test123',
                })
                .expect(200)
        })

        test('Should return 401 if invalid credentials are provided', async () => {
            await request(app)
                .post('/api/signin')
                .send({
                    email: 'test@email.com',
                    password: 'test123',
                })
                .expect(401)
        })
    })
})
