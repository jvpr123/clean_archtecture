import { Router } from 'express'
import { expressMiddlewareAdapter } from '../adapters/ExpressMiddleware.adapter'
import { expressRouteAdapter } from '../adapters/ExpressRoute.adapter'
import { makeAuthMiddleware } from '../factories/Middlewares/AuthMiddleware.factory'

import { makeAddSurveyController } from '../factories/Survey/AddSurveyController.factory'

export default (router: Router): void => {
    router.post('/surveys',
        expressMiddlewareAdapter(makeAuthMiddleware('admin')), 
        expressRouteAdapter(makeAddSurveyController()),
    )
}
