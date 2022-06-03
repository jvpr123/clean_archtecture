import { AccountModel } from "../../../domain/models/Account.model";

export interface ILoadAccountByTokenRepository {
    loadAccountByToken (token: string, role?: string): Promise<AccountModel | null>
}
