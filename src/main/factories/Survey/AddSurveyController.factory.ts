import { IController } from "src/presentation/protocols/controller.interface";
import { AddSurveyController } from "src/presentation/controllers/Survey/AddSurvey/AddSurveyController";

import { LoggerRepository } from "src/infra/database/mongoDB/Logger/LoggerRepository"
import { SurveyMongoRepository } from "src/infra/database/mongoDB/Survey/SurveyRepository";

import { ControllerWithLoggerDecorator } from "src/main/decorators/Logger.decorator";
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
