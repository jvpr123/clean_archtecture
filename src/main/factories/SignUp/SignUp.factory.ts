import { DbAddAccount } from "../../../data/useCases/addAccount/DbAddAccount";
import { AccountMongoRepository } from "../../../infra/database/mongoDB/Account/AccountRepository";

import { IController } from "../../../presentation/protocols/Controller.interface";
import { SignUpController } from "../../../presentation/controllers/SignUp/SignUp";

import { BcryptAdapter } from "../../../infra/criptography/bcrypt/Bcrypt.adapter";
import { EmailValidatorAdapter } from "../../../utils/EmailValidator.adapter";

import { ControllerWithLoggerDecorator } from "../../decorators/Logger.decorator";
import { LoggerRepository } from "../../../infra/database/mongoDB/Logger/LoggerRepository";
import { makeSignUpValidation } from "./SignUpValidation.factory";

export const makeSignUpController = (): IController => {
    const validations = makeSignUpValidation()
    const encrypter = new BcryptAdapter(12)
 
    const accountMongoRepository = new AccountMongoRepository()
    const addAccountRepository = new DbAddAccount(encrypter, accountMongoRepository)
    const loggerRepository = new LoggerRepository()
    
    const signUpController = new SignUpController(
        addAccountRepository, 
        validations,
    )

    return new ControllerWithLoggerDecorator(signUpController, loggerRepository)
}
