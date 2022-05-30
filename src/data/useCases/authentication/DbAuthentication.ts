import { IAuthentication, IAuthenticationModel } from "../../../domain/useCases/Authentication.usecase";
import { IHashComparer, ITokenGenerator } from "../../protocols/criptography/criptographyProtocols";
import { ILoadAccountByEmailRepository, IUpdateAccessTokenRepository } from "../../protocols/database/dbRepositoriesProtocols";

export class DbAuthentication implements IAuthentication {
    constructor (
        private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository,
        private readonly hashComparer: IHashComparer,
        private readonly tokenGenerator: ITokenGenerator,
        private readonly updateAccesTokenRepository: IUpdateAccessTokenRepository,
    ) {}

    async auth(authentication: IAuthenticationModel): Promise<string | null> {
        const account = await this.loadAccountByEmailRepository.load(authentication.email)

        if (account) {
            const isPasswordValid = await this.hashComparer.compare(authentication.password, account.password)

            if (isPasswordValid) {
                const accessToken = await this.tokenGenerator.generate(account.id)
                await this.updateAccesTokenRepository.update(account.id, accessToken)

                return accessToken
            }
        }

        return null
    }
}
