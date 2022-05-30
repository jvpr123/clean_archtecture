import { sign } from 'crypto'
import jwt from 'jsonwebtoken'
import { IEncrypter } from '../../../data/protocols/criptography/Encrypter.interface'

import { JwtAdapter } from './Jwt.adapter'

jest.mock('jsonwebtoken', () => ({
    async sign (): Promise<string> {
        return new Promise((resolve) => resolve('access_token'))
    }
}))

const makeSUT = (): IEncrypter => new JwtAdapter('secret_key')

describe('JWT Adapter', () => {
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

    test('Should throw an error if sign throwa an error', async () => {
        const sut = makeSUT()
        
        jest.spyOn(jwt, 'sign').mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))

        const promise = sut.encrypt('any_id')

        expect(promise).rejects.toThrow()
    })
})
