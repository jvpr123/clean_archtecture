export interface IDecrypter {
    decrypt (token: string): Promise<string | null>
}
