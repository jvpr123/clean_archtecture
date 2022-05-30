import bcrypt from 'bcrypt'

import { IHasher } from "../../../data/protocols/criptography/Hasher.interface";
import { IHashComparer } from "../../../data/protocols/criptography/HashComparer.interface";

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