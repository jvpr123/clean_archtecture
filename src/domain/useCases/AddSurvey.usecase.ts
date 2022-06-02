export interface IAddSurvey {
    add(data: IAddSurveyModel): Promise<void | null>
}

export interface IAddSurveyModel {
    question: string
    answers: ISurveyAnswer[]
    date: Date
}

export interface ISurveyAnswer {
    image?: string
    answer: string
}
