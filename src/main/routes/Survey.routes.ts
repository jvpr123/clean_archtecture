import { Router } from 'express'

import { expressMiddlewareAdapter } from '../adapters/ExpressMiddleware.adapter'
import { expressRouteAdapter } from '../adapters/ExpressRoute.adapter'

import { makeAuthMiddleware } from '../factories/Middlewares/AuthMiddleware.factory'
import { makeAddSurveyController } from '../factories/Survey/AddSurveyController.factory'
import { makeLoadSurveysController } from '../factories/Survey/LoadSurveyController.factory'

export default (router: Router): void => {
    router.post('/surveys',
        expressMiddlewareAdapter(makeAuthMiddleware('admin')), 
        expressRouteAdapter(makeAddSurveyController()),
    )

    router.get('/surveys', 
        expressMiddlewareAdapter(makeAuthMiddleware()),
        expressRouteAdapter(makeLoadSurveysController())
    )
}
