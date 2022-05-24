import { Collection, MongoClient } from "mongodb";

export const MongoHelper = {
    client: null as unknown as MongoClient,

    async connect (uri: string): Promise<void> {
        this.client = await MongoClient.connect(process.env.MONGO_URL || uri)
    },

    async disconnect (): Promise<void> {
        await this.client.close()
    },

    getCollection(collection: string): Collection {
        return this.client.db().collection(collection)
    } 
}