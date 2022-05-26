import { DbAddAccount } from "./DbAddAccount"
import { IEncrypter } from '../../protocols/encrypter.interface'
import { IAddAccountModel } from "../../../domain/useCases/AddAccount.usecase"
import { AccountModel } from "../../../domain/models/Account.model"
import { IAddAccountRepository } from "../../protocols/addAccountRepository.interface"

interface SutTypes {
    sut: DbAddAccount,
    encrypterStub: IEncrypter,
    addAccountRepositoryStub: IAddAccountRepository,
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

const makeEncrypter = (): IEncrypter => {
    class EncrypterStub implements IEncrypter {
        async encrypt(value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }

    return new EncrypterStub()
}

const makeSUT = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

    return {
        sut, 
        encrypterStub,
        addAccountRepositoryStub,
    }
}

describe('DbAddAccount UseCase', () => {
    test('Should call encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSUT()
        const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')
   
        await sut.add(makeFakeAccountData())
        expect(encrypterSpy).toHaveBeenCalledWith('valid_password')
    })

    test('Should throw an error if encrypter throws an exception', async () => {
        const { sut, encrypterStub } = makeSUT()

        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

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
})
