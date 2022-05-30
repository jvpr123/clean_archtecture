import { AccountModel } from '../../../domain/models/Account.model';
import { IAddAccount, IAddAccountModel } from '../../../domain/useCases/AddAccount.usecase'
import { IAddAccountRepository } from '../../protocols/database/addAccountRepository.interface';
import { IHasher } from '../../protocols/criptography/hasher.interface';

export class DbAddAccount implements IAddAccount {
    constructor (
        private readonly encrypter: IHasher,
        private readonly addAccountRepository: IAddAccountRepository,
    ) {}

    async add (account: IAddAccountModel): Promise<AccountModel> {
        const hashedPassword = await this.encrypter.hash(account.password)
        const createdAccount = await this.addAccountRepository.add(Object.assign({}, account, { password: hashedPassword }))

        return new Promise(resolve => resolve(createdAccount))
    }

}
