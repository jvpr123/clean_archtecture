import { loginPath } from './loginPath'

import { accountSchema } from './schemas/account.schema'
import { errorSchema } from './schemas/error.schema'
import { loginSchema } from './schemas/login.schema'

import { badRequest } from './components/badRequest'
import { unauthorized } from './components/unauthorized'
import { serverError } from './components/serverError'
import { notFound } from './components/notFound'

export default {
    openapi: '3.0.0',
    
    info: {
        title: 'Clean Node API',
        description: 'Applying Clean Archtecture and SOLID principles in a Node API',
        version: '1.0.0',
    },

    servers: [{ url: '/api' }],

    tags: [{ name: 'SignIn' }],

    paths: {
        '/signin': loginPath
    },

    schemas: {
        account: accountSchema,
        login: loginSchema,
        error: errorSchema,
    },

    components: {
        badRequest,
        unauthorized,
        notFound,
        serverError,
    }
}
