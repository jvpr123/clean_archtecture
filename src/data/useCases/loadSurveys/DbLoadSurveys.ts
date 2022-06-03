import { SurveyModel } from "src/domain/models/Survey.model";
import { ILoadSurveys } from "src/domain/useCases/LoadSurveys.usecase";
import { ILoadSurveysRepository } from "src/data/protocols/database/loadSurveysRepository.interface";

export class DbLoadSurveys implements ILoadSurveys {
    constructor (
        private readonly loadSurveysRepository: ILoadSurveysRepository,
    ) {}

    async load(): Promise<SurveyModel[]> {
        const surveys = await this.loadSurveysRepository.loadAllSurveys()

        return surveys
    }
}
