import { SurveyModel } from 'src/domain/models/Survey.model'

export interface ILoadSurveyById {
    loadById (id: string): Promise<SurveyModel | null>
} 
