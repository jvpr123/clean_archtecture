import { Router } from 'express'
import { expressRouteAdapter } from '../adapters/ExpressRoute.adapter'
import { makeSignUpController } from '../factories/SignUp.factory'

export default (router: Router): void => {
    router.post('/signup', expressRouteAdapter(makeSignUpController()))
}
