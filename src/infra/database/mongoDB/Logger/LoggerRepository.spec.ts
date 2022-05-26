import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/MongoHelper'
import { LoggerRepository } from './LoggerRepository'

const makeSUT = (): LoggerRepository => new LoggerRepository()

describe('Error Logger MongoDB Repository', () => {
    let errorsCollection: Collection

    beforeAll(async () => await MongoHelper.connect(`${process.env.MONGO_URL}`))

    beforeEach(async () => {
        errorsCollection = MongoHelper.getCollection('errors')
        await errorsCollection.deleteMany({})
    })

    afterAll(async () => await MongoHelper.disconnect())

    test('Should create an error log on success', async () => {
        const sut = makeSUT()
        await sut.log('any_error')

        const count = await errorsCollection.countDocuments()
        expect(count).toBe(1)
    })
})
