import { Express } from 'express'
import { cors } from '../middlewares/cors'
import { bodyParser } from '../middlewares/bodyParser'
import { contentType } from '../middlewares/contentType'

export default (app: Express): void => {
    app.use(bodyParser)
    app.use(cors)
    app.use(contentType)
}