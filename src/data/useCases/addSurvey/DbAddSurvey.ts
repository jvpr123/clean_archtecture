import { IAddSurvey, IAddSurveyModel } from "src/domain/useCases/AddSurvey.usecase";
import { IAddSurveyRepository } from "src/data/protocols/database/addSurveyRepository.interface";

export class DbAddSurvey implements IAddSurvey {
    constructor (
        private readonly addSurveyRepository: IAddSurveyRepository,
    ) {}
        
    async add(data: IAddSurveyModel): Promise<void | null> {
        await this.addSurveyRepository.add(data)
    }
}
