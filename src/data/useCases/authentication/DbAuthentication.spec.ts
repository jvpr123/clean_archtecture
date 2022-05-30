import { AccountModel } from "../../../domain/models/Account.model"
import { DbAuthentication } from "./DbAuthentication"

import { IAuthenticationModel } from "../../../domain/useCases/Authentication.usecase"
import { IEncrypter, IHashComparer } from "../../protocols/criptography/CriptographyProtocols"
import { ILoadAccountByEmailRepository, IUpdateAccessTokenRepository } from "../../protocols/database/DbRepositoriesProtocols"

interface SutTypes {
    sut: DbAuthentication,
    loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository,
    hashComparerStub: IHashComparer,
    tokenGeneratorStub: IEncrypter,
    updateAccessTokenRepositoryStub: IUpdateAccessTokenRepository,
}

const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
        async loadAccountByEmail (email: string): Promise<AccountModel | null> {
            const account: AccountModel = makeFakeAccount()
            
            return new Promise((resolve) => resolve(account))
        }
    }
    
    return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): IHashComparer => {
    class HashComparerStub implements IHashComparer {
        async compare (password: string, hash: string): Promise<boolean> {
            return new Promise((resolve) => resolve(true))
        }
    }
    
    return new HashComparerStub()
}

const makeTokenGenerator = (): IEncrypter => {
    class TokenGeneratorStub implements IEncrypter {
        async encrypt (id: string): Promise<string> {
            return new Promise((resolve) => resolve('access_token'))
        }
    }
    
    return new TokenGeneratorStub()
}

const makeUpdateAccessTokenRepository = (): IUpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub implements IUpdateAccessTokenRepository {
        async updateAccessToken (id: string, token: string): Promise<void> {
            return new Promise((resolve) => resolve())
        }
    }
    
    return new UpdateAccessTokenRepositoryStub()
}

const makeSUT = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const hashComparerStub = makeHashComparer()
    const tokenGeneratorStub = makeTokenGenerator()
    const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
    
    const sut = new DbAuthentication(
        loadAccountByEmailRepositoryStub, 
        hashComparerStub,
        tokenGeneratorStub,
        updateAccessTokenRepositoryStub,
    )
    
    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        tokenGeneratorStub,
        updateAccessTokenRepositoryStub,
    }
}

const makeFakeAuthentication = (): IAuthenticationModel => ({
    email: 'any@email.com',
    password: 'any_password',
})

const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any@email.com',
    password: 'hashed_password',
})

describe('DbAuthentication UseCase', () => {
    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSUT()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadAccountByEmail')
        
        await sut.auth(makeFakeAuthentication())

        expect(loadSpy).toHaveBeenCalledWith('any@email.com')
    })

    test('Should throw an error if LoadAccountByEmailRepository throws an error', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSUT()
        
        jest
            .spyOn(loadAccountByEmailRepositoryStub, 'loadAccountByEmail')
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const promise = sut.auth(makeFakeAuthentication())

        expect(promise).rejects.toThrow()
    })

    test('Should return null if LoadAccountByEmailRepository returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSUT()
        jest
            .spyOn(loadAccountByEmailRepositoryStub, 'loadAccountByEmail')
            .mockReturnValueOnce(new Promise((resolve) => resolve(null)))
        
        const accessToken = await sut.auth(makeFakeAuthentication())

        expect(accessToken).toBe(null)
    })

    test('Should call HashComparer with correct values', async () => {
        const { sut, hashComparerStub } = makeSUT()
        const compareSpy = jest.spyOn(hashComparerStub, 'compare')
        
        await sut.auth(makeFakeAuthentication())

        expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
    })

    test('Should throw an error if HashComparer throws an error', async () => {
        const { sut, hashComparerStub } = makeSUT()
        
        jest
            .spyOn(hashComparerStub, 'compare')
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const promise = sut.auth(makeFakeAuthentication())

        expect(promise).rejects.toThrow()
    })

    test('Should return null if HashComparer returns false', async () => {
        const { sut, hashComparerStub } = makeSUT()
        
        jest
            .spyOn(hashComparerStub, 'compare')
            .mockReturnValueOnce(new Promise((resolve) => resolve(false)))

        const accessToken = await sut.auth(makeFakeAuthentication())

        expect(accessToken).toBe(null)
    })

    test('Should call TokenGenerator with correct id', async () => {
        const { sut, tokenGeneratorStub } = makeSUT()
        const compareSpy = jest.spyOn(tokenGeneratorStub, 'encrypt')
        
        await sut.auth(makeFakeAuthentication())

        expect(compareSpy).toHaveBeenCalledWith('any_id')
    })

    test('Should throw an error if TokenGenerator throws an error', async () => {
        const { sut, tokenGeneratorStub } = makeSUT()
        
        jest
            .spyOn(tokenGeneratorStub, 'encrypt')
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const promise = sut.auth(makeFakeAuthentication())

        expect(promise).rejects.toThrow()
    })

    test('Should return an access-token if TokenGenerator succeeds', async () => {
        const { sut } = makeSUT()
        const accessToken = await sut.auth(makeFakeAuthentication())

        expect(accessToken).toBe('access_token')
    })

    test('Should call UpdateAccessTokenRepository with correct values', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSUT()
        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
        
        await sut.auth(makeFakeAuthentication())

        expect(updateSpy).toHaveBeenCalledWith('any_id', 'access_token')
    })

    test('Should throw an error if UpdateAccessTokenRepository throws an error', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSUT()
        
        jest
            .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const promise = sut.auth(makeFakeAuthentication())

        expect(promise).rejects.toThrow()
    })
})
