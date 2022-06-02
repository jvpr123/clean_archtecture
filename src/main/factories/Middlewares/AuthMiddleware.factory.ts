import { IMiddleware } from "../../../presentation/protocols/middleware.interface";
import { AuthenticationMiddleware } from "../../../presentation/middlewares/Auth.middleware";
import { DbLoadAccountByToken } from "../../../data/useCases/loadAccount/DbLoadAccountByToken";
import { JwtAdapter } from "../../../infra/criptography/jwt/Jwt.adapter";
import env from "../../config/env";
import { AccountMongoRepository } from '../../../infra/database/mongoDB/Account/AccountRepository'

export const makeAuthMiddleware = (role?: string): IMiddleware => {
    const decrypter = new JwtAdapter(env.jwtSecret)
    const loadAccountByTokenrepository = new AccountMongoRepository()

    const loadAccountByToken = new DbLoadAccountByToken(
        decrypter,
        loadAccountByTokenrepository,
    )

    return new AuthenticationMiddleware(loadAccountByToken, role)
}
