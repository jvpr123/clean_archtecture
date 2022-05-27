export interface IAuthentication {
    auth (authentication: IAuthenticationModel): Promise<string | null>
}

export interface IAuthenticationModel {
    email: string,
    password: string,
}
