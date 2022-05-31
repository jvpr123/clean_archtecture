import { IController } from "../../../presentation/protocols/controller.interface";
import { SignInController } from "../../../presentation/controllers/SignIn/SignIn";

import { DbAuthentication } from "../../../data/useCases/authentication/DbAuthentication";

import { LoggerRepository } from "../../../infra/database/mongoDB/Logger/LoggerRepository";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt/Bcrypt.adapter";
import { JwtAdapter } from "../../../infra/criptography/jwt/Jwt.adapter";
import { AccountMongoRepository } from "../../../infra/database/mongoDB/Account/AccountRepository";

import { ControllerWithLoggerDecorator } from "../../decorators/Logger.decorator";
import { makeSignInValidation } from "./SignInValidation.factory";
import env from "../../config/env";

export const makeSignInController = (): IController => {
    const accountRepository = new AccountMongoRepository()
    const hashComparer = new BcryptAdapter(+env.bcryptSalt)
    const tokenGenerator = new JwtAdapter(env.jwtSecret)

    const validation = makeSignInValidation()
    const authentication = new DbAuthentication(
        accountRepository, 
        hashComparer, 
        tokenGenerator, 
        accountRepository
    )

    const signInController = new SignInController(validation, authentication)
    const loggerRepository = new LoggerRepository()

    return new ControllerWithLoggerDecorator(signInController, loggerRepository)
}
