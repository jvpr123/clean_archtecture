import { IEncrypter } from "../../data/protocols/criptography/encrypter.interface";
import bcrypt from 'bcrypt'

export class BcryptAdapter implements IEncrypter {
    constructor (private readonly salt: number) {}

    async encrypt(value: string): Promise<string> {
        return await bcrypt.hash(value, this.salt)
    }
}