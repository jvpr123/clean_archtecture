import { AccountModel } from "../../../domain/models/Account.model";

export interface ILoadAccountByEmailRepository {
    load (email: string): Promise<AccountModel | null>
}
