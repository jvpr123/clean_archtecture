import { Router } from 'express'
import { expressRouteAdapter } from '../adapters/ExpressRoute.adapter'

import { makeSignUpController } from '../factories/SignUp/SignUp.factory'
import { makeSignInController } from '../factories/SignIn/SignIn.factory'

export default (router: Router): void => {
    router.post('/signup', expressRouteAdapter(makeSignUpController()))
    router.post('/signin', expressRouteAdapter(makeSignInController()))
}
