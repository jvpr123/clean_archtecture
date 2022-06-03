import { IAddSurveyModel } from 'src/domain/useCases/AddSurvey.usecase'
import { IAddSurveyRepository } from 'src/data/protocols/database/addSurveyRepository.interface'

import { DbAddSurvey } from './DbAddSurvey'

const makeFakeSurveyData = (): IAddSurveyModel => ({
    question: 'any_question',
    answers: [
        { image: 'any_image', answer: 'any_answer' }
    ]
})

const makeAddSurveyRepository = (): IAddSurveyRepository => {
    class AddSurveyRepositoryStub implements IAddSurveyRepository {
        async add(surveyData: IAddSurveyModel): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }
    
    return new AddSurveyRepositoryStub()
}

type SutTypes = {
    sut: DbAddSurvey
    addSurveyRepositoryStub: IAddSurveyRepository
}

const makeSUT = (): SutTypes => {
    const addSurveyRepositoryStub = makeAddSurveyRepository()
    const sut = new DbAddSurvey(addSurveyRepositoryStub)

    return {
        sut,
        addSurveyRepositoryStub,
    }
}

describe('DbAddSurvey UseCase', () => {
    test('Should call AddSurveyReposository with correct values', async () => {
        const { sut, addSurveyRepositoryStub } = makeSUT()
        const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
        const surveyData = makeFakeSurveyData()
        
        await sut.add(surveyData)

        expect(addSpy).toHaveBeenCalledWith(surveyData)
    })

    test('Should throw and error if AddSurveyRepository throws an exception', async () => {
        const { sut, addSurveyRepositoryStub } = makeSUT()

        jest
            .spyOn(addSurveyRepositoryStub, 'add')
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const promise = sut.add(makeFakeSurveyData())

        expect(promise).rejects.toThrow()
    })
})
