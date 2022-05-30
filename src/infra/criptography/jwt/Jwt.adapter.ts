import jwt from 'jsonwebtoken'

import { IEncrypter } from "../../../data/protocols/criptography/Encrypter.interface";

export class JwtAdapter implements IEncrypter {
    constructor (private readonly secret: string) {}

    async encrypt(id: string): Promise<string | null> {
        const accessToken = await jwt.sign({ id }, this.secret)

        return new Promise((resolve) => resolve(accessToken))
    }
}