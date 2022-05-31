import { AccountModel } from '../../../domain/models/Account.model';
import { IAddAccount, IAddAccountModel } from '../../../domain/useCases/AddAccount.usecase'
import { IAddAccountRepository } from '../../protocols/database/addAccountRepository.interface';
import { IHasher } from '../../protocols/criptography/hasher.interface';
import { ILoadAccountByEmailRepository } from '../../protocols/database/loadAccountByEmailRepository.interface';
import { EmailAlreadyInUseError } from '../../../presentation/errors';

export class DbAddAccount implements IAddAccount {
    constructor (
        private readonly encrypter: IHasher,
        private readonly addAccountRepository: IAddAccountRepository,
        private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    ) {}

    async add (account: IAddAccountModel): Promise<AccountModel | null> {
        const emailAlreadyExists = await this.loadAccountByEmailRepository.loadAccountByEmail(account.email)

        if (emailAlreadyExists) {
            return null
        }

        const hashedPassword = await this.encrypter.hash(account.password)
        const createdAccount = await this.addAccountRepository.add(Object.assign({}, account, { password: hashedPassword }))

        return createdAccount
    }
}
