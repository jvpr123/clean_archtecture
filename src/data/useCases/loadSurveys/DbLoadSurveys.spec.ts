import { SurveyModel } from 'src/domain/models/Survey.model'
import { ILoadSurveysRepository } from 'src/data/protocols/database/loadSurveysRepository.interface'
import { DbLoadSurveys } from './DbLoadSurveys'

const makeFakeSurveys = (): SurveyModel[] => ([
    {
        id: 'any_id',
        question: 'any_question',
        answers: [{ image: 'any_image', answer: 'any_answer' }],
    },
])

const makeLoadSurveysRepository = (): ILoadSurveysRepository => {
    class LoadSurveysRepositoryStub implements ILoadSurveysRepository {
        loadAllSurveys(): Promise<SurveyModel[]> {
            return new Promise(resolve => resolve(makeFakeSurveys()))
        }
    }

    return new LoadSurveysRepositoryStub()
}

type SutTypes = {
    sut: DbLoadSurveys,
    loadSurveysRepositoryStub: ILoadSurveysRepository,
}

const makeSUT = (): SutTypes => {
    const loadSurveysRepositoryStub = makeLoadSurveysRepository()
    const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

    return {
        sut,
        loadSurveysRepositoryStub,
    }
}

describe('DbLoadSurveys UseCase', () => {
    test('Should call LoadSurveysRepository with correct values', async () => {
        const { sut, loadSurveysRepositoryStub } = makeSUT()
        const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAllSurveys')
        
        await sut.load()
        expect(loadAllSpy).toHaveBeenCalledWith()
    })

    test('Should return a list of surveys on success', async () => {
        const { sut } = makeSUT()
        const surveys = await sut.load()
        
        expect(surveys).toEqual(makeFakeSurveys())
    })

    test('Should throw an error if LoadSurveysRepository throws an error', async () => {
        const { sut, loadSurveysRepositoryStub } = makeSUT()
        jest
            .spyOn(loadSurveysRepositoryStub, 'loadAllSurveys')
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        
        const promise = sut.load()
        
        expect(promise).rejects.toThrow()
    })
})
