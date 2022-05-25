import { MongoHelper } from '../infra/database/mongoDB/helpers/MongoHelper'
import app from './config/app'
import env from './config/env'

MongoHelper.connect(env.mongoUrl)
    .then(() => {
        app.listen(env.port, () => {
            console.log('[INFO] Database successfully connected')
            console.log(`[INFO] Server running on http://localhost:${env.port}/`)
        })
    })
    .catch(console.error)

