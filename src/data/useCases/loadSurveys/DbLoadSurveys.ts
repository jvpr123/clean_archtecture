import { SurveyModel } from "../../../domain/models/Survey.model";
import { ILoadSurveys } from "../../../domain/useCases/LoadSurveys.usecase";
import { ILoadSurveysRepository } from "../../protocols/database/loadSurveysRepository.interface";

export class DbLoadSurveys implements ILoadSurveys {
    constructor (
        private readonly loadSurveysRepository: ILoadSurveysRepository,
    ) {}

    async load(): Promise<SurveyModel[]> {
        const surveys = await this.loadSurveysRepository.loadAllSurveys()

        return surveys
    }
}
