import { DbAddAccount } from "./DbAddAccount"
import { IHasher } from '../../protocols/criptography/hasher.interface'
import { IAddAccountModel } from "../../../domain/useCases/AddAccount.usecase"
import { AccountModel } from "../../../domain/models/Account.model"
import { IAddAccountRepository } from "../../protocols/database/addAccountRepository.interface"
import { ILoadAccountByEmailRepository } from "../../protocols/database/loadAccountByEmailRepository.interface"

interface SutTypes {
    sut: DbAddAccount,
    encrypterStub: IHasher,
    addAccountRepositoryStub: IAddAccountRepository,
    loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository,
}

const makeFakeAccount = (): AccountModel => ({ 
    id: 'valid_id', 
    name: 'valid_name', 
    email: 'valid@email.com', 
    password: 'hashed_password' 
})

const makeFakeAccountData = (): IAddAccountModel => ({
    name: 'valid_name',
    email: 'valid@email.com',
    password: 'valid_password',
})

const makeAddAccountRepository = (): IAddAccountRepository => {
    class AddAccountRepositoryStub implements IAddAccountRepository {
        async add(account: IAddAccountModel): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }

    return new AddAccountRepositoryStub()
}

const makeEncrypter = (): IHasher => {
    class EncrypterStub implements IHasher {
        async hash(value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }

    return new EncrypterStub()
}

const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
        async loadAccountByEmail (email: string): Promise<AccountModel | null> {
            return new Promise((resolve) => resolve(null))
        }
    }
    
    return new LoadAccountByEmailRepositoryStub()
}

const makeSUT = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()

    const sut = new DbAddAccount(
        encrypterStub, 
        addAccountRepositoryStub,
        loadAccountByEmailRepositoryStub,
    )

    return {
        sut, 
        encrypterStub,
        addAccountRepositoryStub,
        loadAccountByEmailRepositoryStub,
    }
}

describe('DbAddAccount UseCase', () => {
    test('Should call encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSUT()
        const encrypterSpy = jest.spyOn(encrypterStub, 'hash')
   
        await sut.add(makeFakeAccountData())
        expect(encrypterSpy).toHaveBeenCalledWith('valid_password')
    })

    test('Should throw an error if encrypter throws an exception', async () => {
        const { sut, encrypterStub } = makeSUT()

        jest.spyOn(encrypterStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const addAccountPromise = sut.add(makeFakeAccountData())
        expect(addAccountPromise).rejects.toThrow()
    })

    test('Should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSUT()

        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

        await sut.add(makeFakeAccountData())
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid@email.com',
            password: 'hashed_password',
        })
    })

    test('Should throw an error if addAccountRepository throws an exception', async () => {
        const { sut, addAccountRepositoryStub } = makeSUT()

        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const addAccountPromise = sut.add(makeFakeAccountData())
        expect(addAccountPromise).rejects.toThrow()
    })

    test('Should return a created account on success', async () => {
        const { sut } = makeSUT()
        const account = await sut.add(makeFakeAccountData())

        expect(account).toEqual(makeFakeAccount())
    })

    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSUT()
        jest
            .spyOn(loadAccountByEmailRepositoryStub, 'loadAccountByEmail')
            .mockReturnValueOnce(new Promise((resolve) => resolve(makeFakeAccount())))
        const account = await sut.add(makeFakeAccountData())

        expect(account).toBe(null)
    })
})
