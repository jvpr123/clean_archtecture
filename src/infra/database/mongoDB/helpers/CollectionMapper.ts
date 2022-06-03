import { AccountModel } from "../../../../domain/models/Account.model";

export const map = (mongoCollection: any): any => {
    const { _id, ...data } = Object.assign({}, mongoCollection, { id: mongoCollection?._id})

        return data
}

export const mapArrayCollection = (mongoCollection: any[]): any => {
    let mappedDocuments = []

    for (const mongoDocument of mongoCollection) {
        const { _id, ...data } = Object.assign({}, mongoDocument, { id: mongoDocument?._id})
        mappedDocuments.push(data)
    }

    return mappedDocuments
}
