import { DbAddAccount } from "../../data/useCases/addAccount/DbAddAccount";
import { AccountMongoRepository } from "../../infra/database/mongoDB/Account/AccountRepository";

import { IController } from "../../presentation/protocols/controller.interface";
import { SignUpController } from "../../presentation/controllers/SignUp";

import { BcryptAdapter } from "../../infra/criptography/Bcrypt.adapter";
import { EmailValidatorAdapter } from "../../utils/EmailValidator.adapter";

import { ControllerWithLoggerDecorator } from "../decorators/Logger.decorator";
import { LoggerRepository } from "../../infra/database/mongoDB/Logger/LoggerRepository";

export const makeSignUpController = (): IController => {
    const emailValidator = new EmailValidatorAdapter()
    const encrypter = new BcryptAdapter(12)
 
    const accountMongoRepository = new AccountMongoRepository()
    const addAccountRepository = new DbAddAccount(encrypter, accountMongoRepository)
    const loggerRepository = new LoggerRepository()
    
    const signUpController = new SignUpController(emailValidator, addAccountRepository)

    return new ControllerWithLoggerDecorator(signUpController, loggerRepository)
}
