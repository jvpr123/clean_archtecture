import { MongoHelper } from '../helpers/MongoHelper'
import { AccountMongoRepository } from './AccountRepository'

const makeSUT = (): AccountMongoRepository => {
    return new AccountMongoRepository()
}

describe('Account MongoDB Repository', () => {
    beforeAll(async () => await MongoHelper.connect(`${process.env.MONGO_URL}`))

    beforeEach(async () => {
        const collection = MongoHelper.getCollection('accounts')
        await collection.deleteMany({})
    })

    afterAll(async () => await MongoHelper.disconnect())

    test('Should return an account on success', async () => {
        const sut = makeSUT()
        
        const account = await sut.add({
            name: 'any_name',
            email: 'any@email.com',
            password: 'any_password',
        })

        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe('any_name')
        expect(account.email).toBe('any@email.com')
        expect(account.password).toBe('any_password')
    })
})
