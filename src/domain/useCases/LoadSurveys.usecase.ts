import { SurveyModel } from 'src/domain/models/Survey.model'

export interface ILoadSurveys {
    load (): Promise<SurveyModel[]>
} 
