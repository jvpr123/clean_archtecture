import { Collection } from 'mongodb'
import { IAddAccountModel } from '../../../../domain/useCases/AddAccount.usecase'
import { MongoHelper } from '../helpers/MongoHelper'
import { AccountMongoRepository } from './AccountRepository'

const makeSUT = (): AccountMongoRepository => {
    return new AccountMongoRepository()
}

const makeFakeData = (): IAddAccountModel => ({
    name: 'any_name',
    email: 'any@email.com',
    password: 'any_password',
})

let collection: Collection

describe('Account MongoDB Repository', () => {
    beforeAll(async () => await MongoHelper.connect(`${process.env.MONGO_URL}`))

    beforeEach(async () => {
        collection = MongoHelper.getCollection('accounts')
        await collection.deleteMany({})
    })

    afterAll(async () => await MongoHelper.disconnect())

    describe('add()', () => {
        test('Should return an account on add success', async () => {
            const sut = makeSUT()
            const account = await sut.add(makeFakeData())
    
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('any_name')
            expect(account.email).toBe('any@email.com')
            expect(account.password).toBe('any_password')
        })
    })

    describe('loadAccountByEmail()', () => {
        test('Should return an account on loadAccountByEmail success', async () => {
            const sut = makeSUT()
            await collection.insertOne(makeFakeData())
    
            const account = await sut.loadAccountByEmail('any@email.com')
    
            expect(account).toBeTruthy()
            expect(account?.id).toBeTruthy()
            expect(account?.name).toBe('any_name')
            expect(account?.email).toBe('any@email.com')
            expect(account?.password).toBe('any_password')
        })
    
        test('Should return an account on loadAccountByEmail success', async () => {
            const sut = makeSUT()
            const account = await sut.loadAccountByEmail('any@email.com')
    
            expect(account).toBeFalsy()
        })
    })

    describe('updateAccessToken()', () => {
        test('Should update the account access-token on updateAccessToken success', async () => {
            const sut = makeSUT()
            const account = await sut.add(makeFakeData())
    
            await sut.updateAccessToken(account.id, 'access_token')
            const updated = await collection.findOne({ _id: account.id })
    
            expect(updated).toBeTruthy()
            expect(updated?.accessToken).toBe('access_token')
        })
    })

    describe('loadAccountByToken()', () => {
        test('Should return an account if loadAccountByToken without role field succeeds', async () => {
            const sut = makeSUT()
            await collection.insertOne({
                accessToken: 'access_token', 
                ...makeFakeData(),
            })
    
            const account = await sut.loadAccountByToken('access_token')
    
            expect(account).toBeTruthy()
            expect(account?.id).toBeTruthy()
            expect(account?.name).toBe('any_name')
            expect(account?.email).toBe('any@email.com')
            expect(account?.password).toBe('any_password')
        })

        test('Should return an account if loadAccountByToken matches role and succeeds', async () => {
            const sut = makeSUT()
            await collection.insertOne({
                accessToken: 'access_token',
                role: 'admin', 
                ...makeFakeData(),
            })
    
            const account = await sut.loadAccountByToken('access_token', 'admin')
    
            expect(account).toBeTruthy()
            expect(account?.id).toBeTruthy()
            expect(account?.name).toBe('any_name')
            expect(account?.email).toBe('any@email.com')
            expect(account?.password).toBe('any_password')
        })

        test('Should return an account if loadAccountByToken role does not match but user is admin', async () => {
            const sut = makeSUT()
            await collection.insertOne({
                accessToken: 'access_token',
                ...makeFakeData(),
            })
    
            const account = await sut.loadAccountByToken('access_token', 'admin')
    
            expect(account).toBeTruthy()
            expect(account?.id).toBeTruthy()
            expect(account?.name).toBe('any_name')
            expect(account?.email).toBe('any@email.com')
            expect(account?.password).toBe('any_password')
        })

        test('Should return null if loadAccountByToken role does not match', async () => {
            const sut = makeSUT()
            await collection.insertOne({
                accessToken: 'access_token',
                role: 'admin', 
                ...makeFakeData(),
            })
    
            const account = await sut.loadAccountByToken('access_token', 'invalid_role')
    
            expect(account).toBeFalsy()
        })

        test('Should return null if loadAccountByToken fails', async () => {
            const sut = makeSUT()    
            const account = await sut.loadAccountByToken('access_token')
    
            expect(account).toBeFalsy()
        })
    })
})
