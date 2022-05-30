export interface IHashComparer {
    compare (passwoprd: string, hash: string): Promise<boolean>
}
