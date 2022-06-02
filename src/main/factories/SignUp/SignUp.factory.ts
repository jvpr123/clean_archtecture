import { IController } from "../../../presentation/protocols/controller.interface";
import { SignUpController } from "../../../presentation/controllers/Login/SignUp/SignUp";

import { DbAddAccount } from "../../../data/useCases/addAccount/DbAddAccount";
import { DbAuthentication } from "../../../data/useCases/authentication/DbAuthentication";

import { AccountMongoRepository } from "../../../infra/database/mongoDB/Account/AccountRepository";
import { LoggerRepository } from "../../../infra/database/mongoDB/Logger/LoggerRepository";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt/Bcrypt.adapter";
import { JwtAdapter } from "../../../infra/criptography/jwt/Jwt.adapter";

import { ControllerWithLoggerDecorator } from "../../decorators/Logger.decorator";
import { makeSignUpValidation } from "./SignUpValidation.factory";
import env from "../../config/env";

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
