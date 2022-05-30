import { IAddAccountModel } from "../../../../domain/useCases/AddAccount.usecase";
import { IAddAccountRepository } from "../../../../data/protocols/database/AddAccountRepository.interface";
import { ILoadAccountByEmailRepository } from "../../../../data/protocols/database/LoadAccountByEmailRepository.interface";
import { IUpdateAccessTokenRepository } from "../../../../data/protocols/database/UpdateAccessTokenRepository.interface";

import { AccountModel } from "../../../../domain/models/Account.model";

import { map } from "../helpers/CollectionMapper";
import { MongoHelper } from "../helpers/MongoHelper";

export class AccountMongoRepository implements 
    IAddAccountRepository, 
    ILoadAccountByEmailRepository, 
    IUpdateAccessTokenRepository {
    async add(account: IAddAccountModel): Promise<AccountModel> {
        const accountCollection = MongoHelper.getCollection('accounts')
        const result = await accountCollection.insertOne(account)
        const mongoAccount = await accountCollection.findOne(result.insertedId)
        
        return map(mongoAccount)
    }
    
    async loadAccountByEmail(email: string): Promise<AccountModel | null> {
        const accountCollection = MongoHelper.getCollection('accounts')
        const account = await accountCollection.findOne({ email: email })
        
        return account ? map(account) : null
    }
    
    async updateAccessToken(id: string, token: string): Promise<void> {
        const accountCollection = MongoHelper.getCollection('accounts')
        await accountCollection.updateOne({ _id: id }, { $set: { accessToken: token } })
    }
}
