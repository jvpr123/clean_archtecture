import { IHttpRequest } from '../../../protocols/http.interface'
import { IValidation } from '../../../protocols/validation.interface'

import { badRequest, noContent, serverError } from '../../../helpers/http/httpHelper'

import { AddSurveyController } from './AddSurveyController'
import { IAddSurvey, IAddSurveyModel } from '../../../../domain/useCases/AddSurvey.usecase'

const makeFakeRequest = (): IHttpRequest => ({
    body: {
        question: 'any_question',
        answers: [
            {
                image: 'any_image',
                answer: 'any_answer',
            },
        ],
    }
})

const makeValidation = (): IValidation => {
    class ValidationStub implements IValidation {
        validate(input: any): Error| undefined {
            return undefined
        }
    }
    
    return new ValidationStub()
}

const makeAddSurvey = (): IAddSurvey => {
    class AddSurveyStub implements IAddSurvey {
        async add(data: IAddSurveyModel): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }
    
    return new AddSurveyStub()
}

interface SutTypes {
    sut: AddSurveyController,
    validationStub: IValidation,
    addSurveyStub: IAddSurvey,
}

const makeSUT = (): SutTypes => {
    const validationStub = makeValidation()
    const addSurveyStub = makeAddSurvey()
    const sut = new AddSurveyController(validationStub, addSurveyStub)

    return {
        sut,
        validationStub,
        addSurveyStub,
    }
}

describe('AddSurvey Controller', () => {
    test('Should call validation with correct values', async () => {
        const { sut, validationStub } = makeSUT()
        const validateSpy = jest.spyOn(validationStub, 'validate')

        await sut.handle(makeFakeRequest())

        expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
    })

    test('Should return 400 if validation fails', async () => {
        const { sut, validationStub } = makeSUT()

        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(badRequest(new Error()))
    })

    test('Should call AddSurvey with correct values', async () => {
        const { sut, addSurveyStub } = makeSUT()
        const addSpy = jest.spyOn(addSurveyStub, 'add')

        await sut.handle(makeFakeRequest())

        expect(addSpy).toHaveBeenCalledWith(makeFakeRequest().body)
    })

    test('Should return 500 if AddSurvey throws an error', async () => {
        const { sut, addSurveyStub } = makeSUT()

        jest
            .spyOn(addSurveyStub, 'add')
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        
        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should return 204 on success', async () => {
        const { sut } = makeSUT()
        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(noContent())
    })
})
