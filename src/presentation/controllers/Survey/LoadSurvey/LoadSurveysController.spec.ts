import { LoadSurveysController } from './LoadSurveysController'
import { SurveyModel } from 'src/domain/models/Survey.model'
import { ILoadSurveys } from 'src/domain/useCases/LoadSurveys.usecase'
import { noContent, ok, serverError } from 'src/presentation/helpers/http/httpHelper'

const makeFakeSurveys = (): SurveyModel[] => ([
    {
        id: 'any_id',
        question: 'any_question',
        answers: [{ image: 'any_image', answer: 'any_answer' }],
    },
])

const makeLoadSurveys = (): ILoadSurveys => {
    class LoadSurveysStub implements ILoadSurveys {
        async load(): Promise<SurveyModel[]> {
            return new Promise(resolve => resolve(makeFakeSurveys()))
        }
    }

    return new LoadSurveysStub()
}

type SutTypes = {
    sut: LoadSurveysController,
    loadSurveysStub: ILoadSurveys,
}

const makeSUT = (): SutTypes => {
    const loadSurveysStub = makeLoadSurveys()
    const sut = new LoadSurveysController(loadSurveysStub)

    return {
        sut,
        loadSurveysStub,
    }
}

describe('LoadSurvey Controller', () => {
    test('Should call LoadSurveys correctly', async () => {
        const { sut, loadSurveysStub } = makeSUT()
        const loadSpy = jest.spyOn(loadSurveysStub, 'load')
        
        await sut.handle({})
        expect(loadSpy).toHaveBeenCalledWith()
    })

    test('Should return 200 on success', async () => {
        const { sut } = makeSUT()
        const httpResponse = await sut.handle({})

        expect(httpResponse).toEqual(ok(makeFakeSurveys()))
    })

    test('Should return 204 if there is no survey registered', async () => {
        const { sut, loadSurveysStub } = makeSUT()
        jest
            .spyOn(loadSurveysStub, 'load')
            .mockReturnValueOnce(new Promise(resolve => resolve([])))
        const httpResponse = await sut.handle({})

        expect(httpResponse).toEqual(noContent())
    })

    test('Should return 500 if LoadSurveys throws an exception', async () => {
        const { sut, loadSurveysStub } = makeSUT()
        jest
            .spyOn(loadSurveysStub, 'load')
            .mockReturnValueOnce(new  Promise((resolve, reject) => reject(new Error())))
        const httpResponse = await sut.handle({})

        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
