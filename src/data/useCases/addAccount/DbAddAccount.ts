import { AccountModel } from '../../../domain/models/Account.model';
import { IAddAccount, IAddAccountModel } from '../../../domain/useCases/AddAccount.usecase'
import { IAddAccountRepository } from '../../protocols/database/addAccountRepository.interface';
import { IEncrypter } from '../../protocols/criptography/encrypter.interface';

export class DbAddAccount implements IAddAccount {
    constructor (
        private readonly encrypter: IEncrypter,
        private readonly addAccountRepository: IAddAccountRepository,
    ) {}

    async add (account: IAddAccountModel): Promise<AccountModel> {
        const hashedPassword = await this.encrypter.encrypt(account.password)
        const createdAccount = await this.addAccountRepository.add(Object.assign({}, account, { password: hashedPassword }))

        return new Promise(resolve => resolve(createdAccount))
    }

}
