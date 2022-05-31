import { AccountModel } from "../models/Account.model";

export interface IAddAccount {
    add(account: IAddAccountModel): Promise<AccountModel | null>
}

export interface IAddAccountModel {
    name: string;
    email: string;
    password: string;
} 
