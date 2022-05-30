import { ILoggerRepository } from "../../../../data/protocols/database/LoggerRepository.interface";
import { MongoHelper } from "../helpers/MongoHelper";

export class LoggerRepository implements ILoggerRepository {
    async log(stack: string): Promise<void> {
        const errorsCollection = MongoHelper.getCollection('errors')

        await errorsCollection.insertOne({
            stack,
            date: new Date(),
        })
    }
}
