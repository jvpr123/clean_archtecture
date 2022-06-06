import { SurveyModel } from 'src/domain/models/Survey.model'
import { DbLoadSurveyById } from './DbLoadSurveyById'

import { ILoadSurveyByIdRepository } from 'src/data/protocols/database/loadSurveyById.interface'

const makeFakeSurvey = (): SurveyModel => ({
        id: 'any_id',
        question: 'any_question',
        answers: [{ image: 'any_image', answer: 'any_answer' }],
    })

const makeLoadSurveyByIdRepository = (): ILoadSurveyByIdRepository => {
    class LoadSurveyByIdRepositoryStub implements ILoadSurveyByIdRepository {
        loadById(id: string): Promise<SurveyModel> {
            return new Promise(resolve => resolve(makeFakeSurvey()))
        }
    }

    return new LoadSurveyByIdRepositoryStub()
}

type SutTypes = {
    sut: DbLoadSurveyById,
    loadSurveyByIdRepositoryStub: ILoadSurveyByIdRepository,
}

const makeSUT = (): SutTypes => {
    const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository()
    const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)

    return {
        sut,
        loadSurveyByIdRepositoryStub,
    }
}

describe('DbLoadSurveyById UseCase', () => {
    test('Should call LoadSurveyByIdRepository with correct values', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = makeSUT()
        const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
        
        await sut.loadById('any_id')
        expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
    })

    test('Should return a survey on success', async () => {
        const { sut } = makeSUT()  
        const survey = await sut.loadById('any_id')

        expect(survey).toEqual(makeFakeSurvey())
    })

    test('Should throw an error if LoadSurveyByIdRepository throws an error', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = makeSUT()
        jest
            .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
            .mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.loadById('any_id')

        expect(promise).rejects.toThrow()
    })
})
