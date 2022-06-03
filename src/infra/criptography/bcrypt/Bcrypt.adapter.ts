import bcrypt from 'bcrypt'

import { IHasher } from "src/data/protocols/criptography/hasher.interface";
import { IHashComparer } from "src/data/protocols/criptography/hashComparer.interface";

export class BcryptAdapter implements IHasher, IHashComparer {
    constructor (private readonly salt: number) {}
    
    async hash(value: string): Promise<string> {
        return await bcrypt.hash(value, this.salt)
    }
    
    async compare(password: string, hash: string): Promise<boolean> {
        const isValidPassword = await bcrypt.compare(password, hash)

        return new Promise((resolve) => resolve(isValidPassword))
    }
}