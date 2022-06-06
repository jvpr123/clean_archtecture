import express from 'express'

import setupSwagger from './configSwagger'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
import setupApolloServer from './apolloServer'

const app = express()

setupApolloServer(app)
setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app)

export default app
