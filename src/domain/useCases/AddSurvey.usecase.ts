export interface IAddSurvey {
    add(data: IAddSurveyModel): Promise<void | null>
}

export interface IAddSurveyModel {
    question: string
    answers: ISurveyAnswer[]
}

export interface ISurveyAnswer {
    image?: string
    answer: string
}
