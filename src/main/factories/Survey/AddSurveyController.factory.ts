import { IController } from "../../../presentation/protocols/controller.interface";
import { AddSurveyController } from "../../../presentation/controllers/Survey/AddSurvey/AddSurveyController";

import { LoggerRepository } from "../../../infra/database/mongoDB/Logger/LoggerRepository"
import { SurveyMongoRepository } from "../../../infra/database/mongoDB/Survey/SurveyRepository";

import { ControllerWithLoggerDecorator } from "../../decorators/Logger.decorator";
import { makeAddSurveyValidation } from "./AddSurveyValidation.factory";

export const makeAddSurveyController = (): IController => {
    const validation = makeAddSurveyValidation()
    const surveyRepository = new SurveyMongoRepository()

    const addSurveyController = new AddSurveyController(
        validation,
        surveyRepository,
    )
    const loggerRepository = new LoggerRepository()

    return new ControllerWithLoggerDecorator(addSurveyController, loggerRepository)
}
