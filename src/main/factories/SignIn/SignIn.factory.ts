import { IController } from "src/presentation/protocols/controller.interface";
import { SignInController } from "src/presentation/controllers/Login/SignIn/SignIn";

import { DbAuthentication } from "src/data/useCases/authentication/DbAuthentication";

import { LoggerRepository } from "src/infra/database/mongoDB/Logger/LoggerRepository";
import { BcryptAdapter } from "src/infra/criptography/bcrypt/Bcrypt.adapter";
import { JwtAdapter } from "src/infra/criptography/jwt/Jwt.adapter";
import { AccountMongoRepository } from "src/infra/database/mongoDB/Account/AccountRepository";

import { ControllerWithLoggerDecorator } from "src/main/decorators/Logger.decorator";
import { makeSignInValidation } from "./SignInValidation.factory";
import env from "src/main/config/env";

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
