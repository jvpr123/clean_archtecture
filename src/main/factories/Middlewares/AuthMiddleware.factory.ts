import { IMiddleware } from "src/presentation/protocols/middleware.interface";
import { AuthenticationMiddleware } from "src/presentation/middlewares/Auth.middleware";
import { DbLoadAccountByToken } from "src/data/useCases/loadAccount/DbLoadAccountByToken";
import { JwtAdapter } from "src/infra/criptography/jwt/Jwt.adapter";
import env from "src/main/config/env";
import { AccountMongoRepository } from 'src/infra/database/mongoDB/Account/AccountRepository'

export const makeAuthMiddleware = (role?: string): IMiddleware => {
    const decrypter = new JwtAdapter(env.jwtSecret)
    const loadAccountByTokenrepository = new AccountMongoRepository()

    const loadAccountByToken = new DbLoadAccountByToken(
        decrypter,
        loadAccountByTokenrepository,
    )

    return new AuthenticationMiddleware(loadAccountByToken, role)
}
