import { Router } from 'express'
import { expressRouteAdapter } from '../adapters/ExpressRoute.adapter'

import { makeAddSurveyController } from '../factories/Survey/AddSurveyController.factory'

export default (router: Router): void => {
    router.post('/surveys', expressRouteAdapter(makeAddSurveyController()))
}
