import { apolloServerResolverAdapter } from "src/main/adapters/ApolloServerResolver.adapter"

import { makeSignInController } from "src/main/factories/SignIn/SignIn.factory"
import { makeSignUpController } from "src/main/factories/SignUp/SignUp.factory"

export default {
    Query: {
        signIn: async (_parent: any, args: any) => apolloServerResolverAdapter(makeSignInController(), args)
    },

    Mutation: {
        signUp: async (_parent: any, args: any) => apolloServerResolverAdapter(makeSignUpController(), args)
    }
}
