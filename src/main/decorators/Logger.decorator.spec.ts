import { serverError } from "../../presentation/helpers/http/httpHelper"
import { IController } from "../../presentation/protocols/controller.interface"
import { IHttpRequest, IHttpResponse } from "../../presentation/protocols/http.interface"
import { ILoggerRepository } from '../../data/protocols/database/loggerRepository.interface'
import { ControllerWithLoggerDecorator } from "./Logger.decorator"

interface SutTypes {
    sut: ControllerWithLoggerDecorator
    controllerStub: IController
    loggerRepositoryStub: ILoggerRepository
}

const makeFakeRequest = (): IHttpRequest => ({
    body: {
      name: 'any_name',
      email: "any@email.com",
      password: "any_password",
      passwordConfirmation: "any_password",
    },
})

  const makeFakeResponse = (): IHttpResponse => ({
    statusCode: 200,
    body: {
        id: 'valid_id',
        name: 'valid_name',
        email: "valid@email.com",
        password: "valid_password",
      },
})

const makeControllerStub = (): IController => {
    class ControllerStub implements IController {
        async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
            return new Promise((resolve) => resolve(makeFakeResponse()))
        }
    }
    
    return new ControllerStub()
}

const makeSUT = (): SutTypes => {
    const controllerStub = makeControllerStub()
    const loggerRepositoryStub = makeLoggerRepository()
    const sut = new ControllerWithLoggerDecorator(controllerStub, loggerRepositoryStub)
    
    return {
        sut,
        controllerStub,
        loggerRepositoryStub,
    } 
}

const makeLoggerRepository = (): ILoggerRepository => {
    class LoggerRepositoryStub implements ILoggerRepository {
        async log(stack: string): Promise<void> {
            return new Promise((resolve) => resolve())
        }
    }

    return new LoggerRepositoryStub()
}

describe('Logger Controller Decorator', () => {
    test('Ensure decorator calls Controller`s method .handle', async () => {
        const { sut, controllerStub } = makeSUT()
        const handleSpy = jest.spyOn(controllerStub, 'handle')

        await sut.handle(makeFakeRequest())

        expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
    })

    test('Ensure decorator returns an httpResponse', async () => {
        const { sut } = makeSUT()        
        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(makeFakeResponse())
    })

    test('Should call LoggerRepository with error if Controller returns a server error', async () => {
        const { sut, controllerStub, loggerRepositoryStub } = makeSUT()
        const logSpy = jest.spyOn(loggerRepositoryStub, 'log')
        const fakeError = new Error()

        fakeError.stack = 'any_stack'      
        jest
            .spyOn(controllerStub, 'handle')
            .mockReturnValueOnce(new Promise((resolve) => resolve(serverError(fakeError))))
        
        await sut.handle(makeFakeRequest())

        expect(logSpy).toHaveBeenCalledWith('any_stack')
    })
})
