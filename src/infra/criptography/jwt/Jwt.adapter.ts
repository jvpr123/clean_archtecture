import jwt from 'jsonwebtoken'

import { IEncrypter } from "src/data/protocols/criptography/encrypter.interface";
import { IDecrypter } from 'src/data/protocols/criptography/decrypter.interface';

export class JwtAdapter implements IEncrypter, IDecrypter {
    constructor (private readonly secret: string) {}
    
    async encrypt(id: string): Promise<string | null> {
        const accessToken = await jwt.sign({ id }, this.secret)
        
        return new Promise((resolve) => resolve(accessToken))
    }

    async decrypt(token: string): Promise<string | null> {
        const value: any = await jwt.verify(token, this.secret)

        return value ? value : null
    }
}