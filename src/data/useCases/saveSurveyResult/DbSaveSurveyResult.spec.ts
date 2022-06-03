import { SurveyResultModel } from 'src/domain/models/SurveyResult.model'

import { ISaveSurveyModel } from 'src/domain/useCases/SaveSurveyResult.usecase'
import { ISaveSurveyResultRepository } from 'src/data/protocols/database/saveSurveyResult.interface'
import { DbSaveSurveyResult } from './DbSaveSurveyResult'

const makeFakeSurveyResult = (): SurveyResultModel => ({
    id: 'any_id',
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
})

const makeFakeSaveSurveyData = (): ISaveSurveyModel => ({
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
})

const makeSaveSurveyResultRepository = (): ISaveSurveyResultRepository => {
    class SaveSurveyRepositoryStub implements ISaveSurveyResultRepository {
        async save(data: ISaveSurveyModel): Promise<SurveyResultModel> {
            return new Promise(resolve => resolve(makeFakeSurveyResult()))
        }
    }
    
    return new SaveSurveyRepositoryStub()
}

type SutTypes = {
    sut: DbSaveSurveyResult
    saveSurveyResultRepositoryStub: ISaveSurveyResultRepository
}

const makeSUT = (): SutTypes => {
    const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
    const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)

    return {
        sut,
        saveSurveyResultRepositoryStub,
    }
}

describe('DbSaveSurveyResult UseCase', () => {
    test('Should call SaveSurveyResultRepository with correct values', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSUT()
        const addSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
        const saveSurveyData = makeFakeSaveSurveyData()
        
        await sut.save(saveSurveyData)

        expect(addSpy).toHaveBeenCalledWith(saveSurveyData)
    })
    
    test('Should return a surveyResult on success', async () => {
        const { sut } = makeSUT()  
        const survey = await sut.save(makeFakeSaveSurveyData())

        expect(survey).toEqual(makeFakeSurveyResult())
    })

    test('Should throw an error if SaveSurveyResultRepository throws an error', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSUT()
        jest
            .spyOn(saveSurveyResultRepositoryStub, 'save')
            .mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.save(makeFakeSaveSurveyData())

        expect(promise).rejects.toThrow()
    })
})
