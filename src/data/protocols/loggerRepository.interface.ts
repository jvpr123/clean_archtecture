export interface ILoggerRepository {
    log (stack: string): Promise<void>
}
