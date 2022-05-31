import { Express, Router } from "express"
import { readdirSync } from 'fs'

export default (app: Express): void => {
    const router = Router()
    app.use('/api', router)

    // fg.sync('**/src/main/routes/**.routes.ts').map(async (file) => {
    //     (await import(`../../../${file}`)).default(router)
    // })

    readdirSync(`${__dirname}/../../main/routes`).map(async (file) => {
        if (!file.includes('.test.ts')) {
            (await import(`../routes/${file}`)).default(router)
        }
    })
}
