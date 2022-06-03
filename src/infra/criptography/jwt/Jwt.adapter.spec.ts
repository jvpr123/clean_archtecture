import jwt from 'jsonwebtoken'
import { JwtAdapter } from './Jwt.adapter'

jest.mock('jsonwebtoken', () => ({
    async sign (): Promise<string> {
        return new Promise((resolve) => resolve('access_token'))
    },

    async verify (): Promise<string> {
        return new Promise(resolve => resolve('any_value'))
    }
}))

const makeSUT = (): JwtAdapter => new JwtAdapter('secret_key')

describe('JWT Adapter', () => {
    describe('sign()', () => {
        test('Should call sign with correct values', async () => {
            const sut = makeSUT()
            const signSpy = jest.spyOn(jwt, 'sign')
    
            await sut.encrypt('any_id')
    
            expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret_key')
        })
    
        test('Should return a token if sign succeeds', async () => {
            const sut = makeSUT()
            const accessToken = await sut.encrypt('any_id')
    
            expect(accessToken).toBe('access_token')
        })
    
        test('Should throw an error if sign throws an error', async () => {
            const sut = makeSUT()
            
            jest
                .spyOn(jwt, 'sign')
                .mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))
    
            const promise = sut.encrypt('any_id')
    
            expect(promise).rejects.toThrow()
        })
    })

    describe('verify()', () => {
        test('Should call verify with correct values', async () => {
            const sut = makeSUT()
            const signSpy = jest.spyOn(jwt, 'verify')
    
            await sut.decrypt('access_token')
    
            expect(signSpy).toHaveBeenCalledWith('access_token', 'secret_key')
        })
    
        test('Should return a value if verify succeeds', async () => {
            const sut = makeSUT()
            const accessToken = await sut.decrypt('access_token')
    
            expect(accessToken).toBe('any_value')
        })
    
        test('Should throw an error if verify throws an error', async () => {
            const sut = makeSUT()
            
            jest
                .spyOn(jwt, 'verify')
                .mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))
    
            const promise = sut.decrypt('access_token')
    
            expect(promise).rejects.toThrow()
        })
    })
})
