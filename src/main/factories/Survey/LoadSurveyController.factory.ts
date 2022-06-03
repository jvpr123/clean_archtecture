import { IController } from "../../../presentation/protocols/controller.interface";
import { LoadSurveysController } from "../../../presentation/controllers/Survey/LoadSurvey/LoadSurveysController";

import { LoggerRepository } from "../../../infra/database/mongoDB/Logger/LoggerRepository"
import { SurveyMongoRepository } from '../../../infra/database/mongoDB/Survey/SurveyRepository'

import { ControllerWithLoggerDecorator } from "../../decorators/Logger.decorator";
import { DbLoadSurveys } from "../../../data/useCases/loadSurveys/DbLoadSurveys";

export const makeLoadSurveysController = (): IController => {
    const loadSurveysRepository = new SurveyMongoRepository()
    const loadSurveys = new DbLoadSurveys(loadSurveysRepository)

    const loadSurveysController = new LoadSurveysController(loadSurveys)
    const loggerRepository = new LoggerRepository()

    return new ControllerWithLoggerDecorator(loadSurveysController, loggerRepository)
}
