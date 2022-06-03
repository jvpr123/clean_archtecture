import { AccountModel } from 'src/domain/models/Account.model'
import { DbLoadAccountByToken } from './DbLoadAccountByToken'

import { IDecrypter } from 'src/data/protocols/criptography/criptographyProtocols'
import { ILoadAccountByTokenRepository } from 'src/data/protocols/database/dbRepositoriesProtocols'

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: "valid@email.com",
    password: "valid_password",
  })

const makeDecrypter = (): IDecrypter => {
    class DecrypterStub implements IDecrypter {
        async decrypt(id: string): Promise<string> {
            return new Promise(resolve => resolve('any_value'))
        }
    }
    
    return new DecrypterStub()
}

const makeLoadAccountByTokenRepository = (): ILoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub implements ILoadAccountByTokenRepository {
        async loadAccountByToken(token: string, role?: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    
    return new LoadAccountByTokenRepositoryStub()
}

type SutTypes = {
    sut: DbLoadAccountByToken,
    decrypterStub: IDecrypter,
    loadAccountByTokenRepositoryStub: ILoadAccountByTokenRepository,
    
}

const makeSUT = (): SutTypes => {
    const decrypterStub = makeDecrypter()
    const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
    const sut = new DbLoadAccountByToken(
        decrypterStub,
        loadAccountByTokenRepositoryStub,
    )

    return {
        sut,
        decrypterStub,
        loadAccountByTokenRepositoryStub,
    }
}

describe('DbLoadAccountByToken UseCase', () => {
    test('Should call decrypter with correct values', async () => {
        const { sut, decrypterStub } = makeSUT()
        const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

        await sut.loadAccount('access_token', 'any_role')

        expect(decryptSpy).toHaveBeenCalledWith('access_token')
    })

    test('Should return null if Decrypter return null', async () => {
        const { sut, decrypterStub } = makeSUT()
        jest
            .spyOn(decrypterStub, 'decrypt')
            .mockReturnValueOnce(new Promise(resolve => resolve(null)))

        const account = await sut.loadAccount('access_token', 'any_role')

        expect(account).toBeNull()
    })

    test('Should throw an error if Decrypter throws an error', async () => {
        const { sut, decrypterStub } = makeSUT()
        jest
            .spyOn(decrypterStub, 'decrypt')
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const promise = sut.loadAccount('access_token', 'any_role')

        expect(promise).rejects.toThrow()
    })

    test('Should call LoadAccountByTokenRepository with correct values', async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSUT()
        const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadAccountByToken')

        await sut.loadAccount('access_token', 'any_role')

        expect(loadByTokenSpy).toHaveBeenCalledWith('access_token', 'any_role')
    })

    test('Should return null if LoadAccountByTokenRepository returns null', async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSUT()
        jest
            .spyOn(loadAccountByTokenRepositoryStub, 'loadAccountByToken')
            .mockReturnValueOnce(new Promise(resolve => resolve(null)))

        const account = await sut.loadAccount('access_token', 'any_role')

        expect(account).toBeNull()
    })

    test('Should return an account on LoadAccountByTokenRepository success', async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSUT()
        jest
            .spyOn(loadAccountByTokenRepositoryStub, 'loadAccountByToken')
            .mockReturnValueOnce(new Promise(resolve => resolve(makeFakeAccount())))

        const account = await sut.loadAccount('access_token', 'any_role')

        expect(account).toEqual(makeFakeAccount())
    })

    test('Should throw an error if LoadAccountByTokenRepository throws an error', async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSUT()
        jest
            .spyOn(loadAccountByTokenRepositoryStub, 'loadAccountByToken')
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const promise = sut.loadAccount('access_token', 'any_role')

        expect(promise).rejects.toThrow()
    })
})
