export const unauthorized = {
    description: 'Invalid Credentials provided',
    content: {
        'application/json': {
            schema: {
                $ref: '#/schemas/error'
            }
        }
    }
}
