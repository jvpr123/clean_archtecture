import { IAddAccountRepository } from "../../../../data/protocols/database/addAccountRepository.interface";
import { AccountModel } from "../../../../domain/models/Account.model";
import { IAddAccountModel } from "../../../../domain/useCases/AddAccount.usecase";
import { map } from "../helpers/CollectionMapper";
import { MongoHelper } from "../helpers/MongoHelper";

export class AccountMongoRepository implements IAddAccountRepository {
    async add(account: IAddAccountModel): Promise<AccountModel> {
        const accountCollection = MongoHelper.getCollection('accounts')
        const result = await accountCollection.insertOne(account)

        const mongoAccount = await accountCollection.findOne(result.insertedId)

        return map(mongoAccount)
    }
}