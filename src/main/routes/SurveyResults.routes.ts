import { Router } from 'express'

import { expressMiddlewareAdapter } from '../adapters/ExpressMiddleware.adapter'
import { expressRouteAdapter } from '../adapters/ExpressRoute.adapter'

import { makeAuthMiddleware } from '../factories/Middlewares/AuthMiddleware.factory'
import { makeSaveSurveyResultsController } from '../factories/SurveyResults/SaveSurveyResultsController.factory'

export default (router: Router): void => {
    router.put('/surveys/:surveyId/results',
        expressMiddlewareAdapter(makeAuthMiddleware('user')), 
        expressRouteAdapter(makeSaveSurveyResultsController()),
    )
}
