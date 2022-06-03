import { AccountModel } from "src/domain/models/Account.model";
import { IAddAccountModel } from "src/domain/useCases/AddAccount.usecase";

export interface IAddAccountRepository {
    add (account: IAddAccountModel): Promise<AccountModel>
}
