import { ISurveyAnswer } from "../models/Survey.model"

export interface IAddSurvey {
    add(data: IAddSurveyModel): Promise<void | null>
}

export interface IAddSurveyModel {
    question: string
    answers: ISurveyAnswer[]
}
