import { ILoadAccountByToken } from "../../../domain/useCases/LoadAccountByToken.usecase";
import { IDecrypter } from "../../protocols/criptography/decrypter.interface";
import { ILoadAccountByTokenRepository } from "../../protocols/database/loadAccountByTokenRepository.interface";

import { AccountModel } from "../../../domain/models/Account.model";

export class DbLoadAccountByToken implements ILoadAccountByToken {
    constructor (
        private readonly decrypter: IDecrypter,
        private readonly loadAccountByTokenRepository: ILoadAccountByTokenRepository,
    ) {}

    async loadAccount(token: string, role?: string | undefined): Promise<AccountModel | null> {
        const accessToken = await this.decrypter.decrypt(token)

        if (accessToken) {
            const account = role
                ? await this.loadAccountByTokenRepository.loadAccountByToken(token, role)
                : await this.loadAccountByTokenRepository.loadAccountByToken(token)

            return account ? account : null 

        }
        
        return null
    }
}
