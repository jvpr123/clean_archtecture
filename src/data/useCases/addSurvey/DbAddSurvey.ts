import { IAddSurvey, IAddSurveyModel } from "../../../domain/useCases/AddSurvey.usecase";
import { IAddSurveyRepository } from "../../protocols/database/addSurveyRepository.interface";

export class DbAddSurvey implements IAddSurvey {
    constructor (
        private readonly addSurveyRepository: IAddSurveyRepository,
    ) {}
        
    async add(data: IAddSurveyModel): Promise<void | null> {
        await this.addSurveyRepository.add(data)
    }
}
