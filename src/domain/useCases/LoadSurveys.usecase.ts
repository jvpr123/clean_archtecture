import { SurveyModel } from '../../domain/models/Survey.model'

export interface ILoadSurveys {
    load (): Promise<SurveyModel[]>
} 
