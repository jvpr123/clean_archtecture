import { ApolloError, AuthenticationError, ForbiddenError, UserInputError } from "apollo-server-express";
import { IController } from "src/presentation/protocols/controller.interface";

export const apolloServerResolverAdapter = async (controller: IController, args: any): Promise<any> => {
    const httpResponse = await controller.handle({ body: args })

    switch (httpResponse.statusCode) {
        case 200:
        case 204: return httpResponse.body

        case 400: throw new UserInputError(httpResponse.body.message)
        case 401: throw new AuthenticationError(httpResponse.body.message)
        case 403: throw new ForbiddenError(httpResponse.body.message)

        default: throw new ApolloError(httpResponse.body.message)
    }
}
