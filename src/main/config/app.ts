import express from 'express'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
import setupApolloServer from './apolloServer'

const app = express()

setupApolloServer(app)
setupMiddlewares(app)
setupRoutes(app)

export default app