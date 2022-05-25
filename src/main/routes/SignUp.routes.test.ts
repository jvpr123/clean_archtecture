import request from "supertest"
import app from '../config/app'
import { MongoHelper } from "../../infra/database/mongoDB/helpers/MongoHelper"

describe('SignUp routes', () => {
    beforeAll(async () => await MongoHelper.connect(`${process.env.MONGO_URL}`))

    beforeEach(async () => {
        const collection = MongoHelper.getCollection('accounts')
        await collection.deleteMany({})
    })

    afterAll(async () => await MongoHelper.disconnect())

    test('Should return an account on success', async () => {
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