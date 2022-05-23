import * as config from './jest.config'

export default {
    ...config.default,
    testMatch: ['**/*.test.ts']
}
