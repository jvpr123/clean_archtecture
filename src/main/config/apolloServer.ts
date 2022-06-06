import { ApolloServer } from "apollo-server-express"
import { Express } from "express"

import resolvers from 'src/main/graphql/resolvers'
import typeDefs from 'src/main/graphql/typedefs'

export default async (app: Express): Promise<void> => {
    const server = new ApolloServer({
        resolvers,
        typeDefs,
    })

    await server.start()

    server.applyMiddleware({ app })
}
