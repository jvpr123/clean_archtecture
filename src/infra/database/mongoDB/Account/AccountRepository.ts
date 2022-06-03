import { IAddAccountModel } from "src/domain/useCases/AddAccount.usecase";
import { IAddAccountRepository } from "src/data/protocols/database/addAccountRepository.interface";
import { ILoadAccountByEmailRepository } from "src/data/protocols/database/loadAccountByEmailRepository.interface";
import { IUpdateAccessTokenRepository } from "src/data/protocols/database/updateAccessTokenRepository.interface";
import { ILoadAccountByTokenRepository } from "src/data/protocols/database/loadAccountByTokenRepository.interface";

import { AccountModel } from "src/domain/models/Account.model";

import { map } from "../helpers/CollectionMapper";
import { MongoHelper } from "../helpers/MongoHelper";

export class AccountMongoRepository implements 
    IAddAccountRepository, 
    ILoadAccountByEmailRepository, 
    IUpdateAccessTokenRepository, 
    ILoadAccountByTokenRepository {
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
        
        async loadAccountByToken(token: string, role?: string | undefined): Promise<AccountModel | null> {
            const accountCollection = MongoHelper.getCollection('accounts')
            const account = role === 'admin'
                ? await accountCollection.findOne({ accessToken: token })
                : await accountCollection.findOne({ accessToken: token, role })
            
            return account ? map(account) : null
        }
    }
    