export interface IHttpRequest {
    headers?: any
    body?: any
    params?: any
    accountId?: string
}

export interface IHttpResponse {
    statusCode: number
    body: any
}
