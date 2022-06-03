export interface SurveyModel {
    id: string
    question: string
    answers: ISurveyAnswer[]
}

export interface ISurveyAnswer {
    image?: string
    answer: string
}
