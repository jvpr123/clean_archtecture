import { AccountModel } from "../../../domain/models/Account.model";

export interface ILoadAccountByEmailRepository {
    loadAccountByEmail (email: string): Promise<AccountModel | null>
}
