import { AccountModel } from "../../../../domain/models/Account.model";

export const map = (mongoCollection: any): any => {
    const { _id, ...data } = Object.assign({}, mongoCollection, { id: mongoCollection?._id})

        return data
}