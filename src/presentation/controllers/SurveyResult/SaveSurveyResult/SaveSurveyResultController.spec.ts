import { SaveSurveyResultController } from "./SaveSurveyResultController"

import { SurveyModel } from "src/domain/models/Survey.model"
import { SurveyResultModel } from "src/domain/models/SurveyResult.model"
import { ILoadSurveyById } from "src/domain/useCases/LoadSurveyById.usecase"
import { ISaveSurveyModel, ISaveSurveyResult } from "src/domain/useCases/SaveSurveyResult.usecase"

import { IHttpRequest } from "src/presentation/protocols/http.interface"

import { InvalidParamsError } from "src/presentation/errors"
import { forbbiden, ok, serverError } from "src/presentation/helpers/http/httpHelper"


const makeFakeRequest = (answer?: string): IHttpRequest => ({
    params: { surveyId: 'any_survey_id' },
    body: { 
        answer: answer ? answer : 'any_answer'
    },
    accountId: 'any_account_id',
})

const makeFakeSurvey = (): SurveyModel => ({
        id: 'any_id',
        question: 'any_question',
        answers: [{ image: 'any_image', answer: 'any_answer' }],
})

const makeFakeSurveyResult = (): SurveyResultModel => ({
    id: 'any_id',
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
})

const makeFakeSurveyAnswer = (): Omit<SurveyResultModel, 'id'> => ({
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
})

const makeLoadSurveyById = (): ILoadSurveyById => {
    class LoadSurveyByIdStub implements ILoadSurveyById {
        async loadById(id: string): Promise<SurveyModel | null> {
            return new Promise(resolve => resolve(makeFakeSurvey()))
        }
    }

    return new LoadSurveyByIdStub()
}

const makeSaveSurveyResult = (): ISaveSurveyResult => {
    class SaveSurveyResultStub implements ISaveSurveyResult {
        async save(data: ISaveSurveyModel): Promise<SurveyResultModel | null> {
            return new Promise(resolve => resolve(makeFakeSurveyResult()))
        }
    }

    return new SaveSurveyResultStub()
}

type SutTypes = {
    sut: SaveSurveyResultController,
    loadSurveyByIdStub: ILoadSurveyById,
    saveSurveyResultStub: ISaveSurveyResult,
}

const makeSUT = (): SutTypes => {
    const loadSurveyByIdStub = makeLoadSurveyById()
    const saveSurveyResultStub = makeSaveSurveyResult()
    const sut = new SaveSurveyResultController(
        loadSurveyByIdStub,
        saveSurveyResultStub,
    )

    return {
        sut,
        loadSurveyByIdStub,
        saveSurveyResultStub,
    }
}

describe('SaveSurveyResult Controller', () => {
    test('Should call LoadSurveyById with correct values', async () => {
        const { sut, loadSurveyByIdStub } = makeSUT()
        const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
        
        await sut.handle(makeFakeRequest())
        expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
    })

    test('Should return 403 if LoadSurveyById returns null', async () => {
        const { sut, loadSurveyByIdStub } = makeSUT()
        jest
            .spyOn(loadSurveyByIdStub, 'loadById')
            .mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const httpResponse = await sut.handle(makeFakeRequest())
        
        expect(httpResponse).toEqual(forbbiden(new InvalidParamsError('surveyId')))
    })

    test('Should return 500 if LoadSurveyById throws an error', async () => {
        const { sut, loadSurveyByIdStub } = makeSUT()
        jest
            .spyOn(loadSurveyByIdStub, 'loadById')
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const httpResponse = await sut.handle(makeFakeRequest())
        
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should return 403 if an invalid answer is provided', async () => {
        const { sut } = makeSUT()
        const httpResponse = await sut.handle(makeFakeRequest('invalid_answer'))
        
        expect(httpResponse).toEqual(forbbiden(new InvalidParamsError('answer')))
    })

    test('Should call SaveSurveyResult with correct values', async () => {
        const { sut, saveSurveyResultStub } = makeSUT()
        const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
        
        await sut.handle(makeFakeRequest())
        expect(saveSpy).toHaveBeenCalledWith(makeFakeSurveyAnswer())
    })

    test('Should return 500 if SaveSurveyById throws an error', async () => {
        const { sut, saveSurveyResultStub } = makeSUT()
        jest
            .spyOn(saveSurveyResultStub, 'save')
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const httpResponse = await sut.handle(makeFakeRequest())
        
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should return 200 on SaveSurveyById success', async () => {
        const { sut } = makeSUT()
        const httpResponse = await sut.handle(makeFakeRequest())
        
        expect(httpResponse).toEqual(ok(makeFakeSurveyResult()))
    })
})
