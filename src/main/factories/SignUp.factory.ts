import { DbAddAccount } from "../../data/useCases/addAccount/DbAddAccount";
import { BcryptAdapter } from "../../infra/criptography/Bcrypt.adapter";
import { AccountMongoRepository } from "../../infra/database/mongoDB/Account/AccountRepository";
import { SignUpController } from "../../presentation/controllers/SignUp";
import { EmailValidatorAdapter } from "../../utils/EmailValidator.adapter";

export const makeSignUpController = (): SignUpController => {
    const emailValidator = new EmailValidatorAdapter()
    const encrypter = new BcryptAdapter(12)
 
    const accountMongoRepository = new AccountMongoRepository()
    const addAccountRepository = new DbAddAccount(encrypter, accountMongoRepository)
    
    return new SignUpController(emailValidator, addAccountRepository)
}
