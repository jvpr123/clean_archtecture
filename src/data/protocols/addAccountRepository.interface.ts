import { AccountModel } from "../../domain/models/Account.model";
import { IAddAccountModel } from "../../domain/useCases/AddAccount.usecase";

export interface IAddAccountRepository {
    add (account: IAddAccountModel): Promise<AccountModel>
}