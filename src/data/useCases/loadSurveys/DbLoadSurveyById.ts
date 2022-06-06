import { SurveyModel } from "src/domain/models/Survey.model";

import { ILoadSurveyById } from "src/domain/useCases/LoadSurveyById.usecase";
import { ILoadSurveyByIdRepository } from "src/data/protocols/database/loadSurveyById.interface";

export class DbLoadSurveyById implements ILoadSurveyById {
    constructor (
        private readonly loadSurveyByIdRepository: ILoadSurveyByIdRepository
    ) {}

    async loadById(id: string): Promise<SurveyModel | null> {
        const survey = await this.loadSurveyByIdRepository.loadById(id)

        return survey
    }
    
}
