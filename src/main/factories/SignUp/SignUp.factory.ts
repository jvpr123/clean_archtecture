import { IController } from "src/presentation/protocols/controller.interface";
import { SignUpController } from "src/presentation/controllers/Login/SignUp/SignUp";

import { DbAddAccount } from "src/data/useCases/addAccount/DbAddAccount";
import { DbAuthentication } from "src/data/useCases/authentication/DbAuthentication";

import { AccountMongoRepository } from "src/infra/database/mongoDB/Account/AccountRepository";
import { LoggerRepository } from "src/infra/database/mongoDB/Logger/LoggerRepository";
import { BcryptAdapter } from "src/infra/criptography/bcrypt/Bcrypt.adapter";
import { JwtAdapter } from "src/infra/criptography/jwt/Jwt.adapter";

import { ControllerWithLoggerDecorator } from "src/main/decorators/Logger.decorator";
import { makeSignUpValidation } from "./SignUpValidation.factory";
import env from "src/main/config/env";

export const makeSignUpController = (): IController => {
    const validations = makeSignUpValidation()
    const hashComparer = new BcryptAdapter(+env.bcryptSalt)
    const tokenGenerator = new JwtAdapter(env.jwtSecret)
 
    const accountRepository = new AccountMongoRepository()
    const loggerRepository = new LoggerRepository()
    const addAccountRepository = new DbAddAccount(
        hashComparer, 
        accountRepository, 
        accountRepository
    )
    const authentication = new DbAuthentication(
        accountRepository, 
        hashComparer, 
        tokenGenerator, 
        accountRepository,
    )
    
    const signUpController = new SignUpController(
        addAccountRepository, 
        validations,
        authentication,
    )

    return new ControllerWithLoggerDecorator(signUpController, loggerRepository)
}
