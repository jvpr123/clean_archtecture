import { AccountModel } from "../models/Account.model";

export interface ILoadAccountByToken {
    loadAccount (token: string, role?: string): Promise<AccountModel | null>
} 
