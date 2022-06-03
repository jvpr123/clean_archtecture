import { AuthenticationMiddleware } from '../middlewares/Auth.middleware'
import { ILoadAccountByToken } from 'src/domain/useCases/LoadAccountByToken.usecase'

import { forbbiden, ok, serverError } from '../helpers/http/httpHelper'
import { AccessDeniedError, ServerError } from '../errors'
import { AccountModel } from 'src/domain/models/Account.model'
import { IHttpRequest } from '../protocols/http.interface'

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: "valid@email.com",
    password: "valid_password",
})

const makeFakeRequest = (): IHttpRequest => ({
    headers: { 'x-access-token': 'any_token' }
})

const makeLoadAccountByTokenStub = (): ILoadAccountByToken => {
    class LoadAccountByTokenStub implements ILoadAccountByToken {
        async loadAccount(token: string, role?: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }

    return new LoadAccountByTokenStub()
}

type SutTypes = {
    sut: AuthenticationMiddleware
    loadAccountByTokenStub: ILoadAccountByToken
}

const makeSUT = (role?: string): SutTypes => {
    const loadAccountByTokenStub = makeLoadAccountByTokenStub()
    const sut = new AuthenticationMiddleware(loadAccountByTokenStub, role)

    return {
        sut, 
        loadAccountByTokenStub,
    }
}

describe('Authentication Middleware', () => {
    test('Should call LoadAccountByToken with correct access-token', async () => {
        const { sut, loadAccountByTokenStub } = makeSUT()
        const loadSpy = jest.spyOn(loadAccountByTokenStub, 'loadAccount')
    
        await sut.handle(makeFakeRequest())
    
        expect(loadSpy).toHaveBeenCalledWith('any_token')
    })

    test('Should call LoadAccountByToken with correct access-token and role', async () => {
        const { sut, loadAccountByTokenStub } = makeSUT('any_role')
        const loadSpy = jest.spyOn(loadAccountByTokenStub, 'loadAccount')
    
        await sut.handle(makeFakeRequest())
    
        expect(loadSpy).toHaveBeenCalledWith('any_token', 'any_role')
    })

    test('Should return 403 if x-access-token is not provided in headers', async () => {
        const { sut } = makeSUT()
        const httpResponse = await sut.handle({})

        expect(httpResponse).toEqual(forbbiden(new AccessDeniedError()))
    })

    test('Should return 403 if LoadAccountByToken returns null', async () => {
        const { sut, loadAccountByTokenStub } = makeSUT()
        jest
            .spyOn(loadAccountByTokenStub, 'loadAccount')
            .mockReturnValueOnce(new Promise(resolve => resolve(null)))

        const httpResponse = await sut.handle({})

        expect(httpResponse).toEqual(forbbiden(new AccessDeniedError()))
    })

    test('Should return 500 if LoadAccountByToken throws an error', async () => {
        const { sut, loadAccountByTokenStub } = makeSUT()
        jest
            .spyOn(loadAccountByTokenStub, 'loadAccount')
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new ServerError())))

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(serverError(new ServerError()))
    })

    test('Should return 200 if LoadAccountByToken returns an account', async () => {
        const { sut } = makeSUT()
        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(ok({ accountId: makeFakeAccount().id }))
    })
})
