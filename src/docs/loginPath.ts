export const loginPath = {
    post: {
        tags: ['SignIn'],
        summary: 'API for users authentication',
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/schemas/login'
                    }
                }
            },
        },
        responses: {
            200: {
                description: 'Success',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/schemas/account'
                        }
                    }
                }
            },
            400: {
                $ref: '#/components/badRequest',
            },
            401: {
                $ref: '#/components/unauthorized',
            },
            404: {
                $ref: '#/components/notFound',
            },
            500: {
                $ref: '#/components/serverError',
            }
        }
    }
}
