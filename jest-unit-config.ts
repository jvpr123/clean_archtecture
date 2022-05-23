import * as config from './jest.config'

export default {
    ...config.default,
    testMatch: ['**/*.spec.ts']
}
