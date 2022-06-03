import { IController } from "src/presentation/protocols/controller.interface";
import { LoadSurveysController } from "src/presentation/controllers/Survey/LoadSurvey/LoadSurveysController";

import { LoggerRepository } from "src/infra/database/mongoDB/Logger/LoggerRepository"
import { SurveyMongoRepository } from 'src/infra/database/mongoDB/Survey/SurveyRepository'

import { ControllerWithLoggerDecorator } from "src/main/decorators/Logger.decorator";
import { DbLoadSurveys } from "src/data/useCases/loadSurveys/DbLoadSurveys";

export const makeLoadSurveysController = (): IController => {
    const loadSurveysRepository = new SurveyMongoRepository()
    const loadSurveys = new DbLoadSurveys(loadSurveysRepository)

    const loadSurveysController = new LoadSurveysController(loadSurveys)
    const loggerRepository = new LoggerRepository()

    return new ControllerWithLoggerDecorator(loadSurveysController, loggerRepository)
}
