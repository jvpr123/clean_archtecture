import { IController } from "src/presentation/protocols/controller.interface";

import { LoggerRepository } from "src/infra/database/mongoDB/Logger/LoggerRepository"

import { ControllerWithLoggerDecorator } from "src/main/decorators/Logger.decorator";
import { SaveSurveyResultController } from "src/presentation/controllers/SurveyResult/SaveSurveyResult/SaveSurveyResultController";
import { DbLoadSurveyById } from "src/data/useCases/loadSurveys/DbLoadSurveyById";
import { DbSaveSurveyResult } from "src/data/useCases/saveSurveyResult/DbSaveSurveyResult";
import { SurveyMongoRepository } from "src/infra/database/mongoDB/Survey/SurveyRepository";
import { SurveyResultMongoRepository } from "src/infra/database/mongoDB/SurveyResult/SurveyResultRepository";

export const makeSaveSurveyResultsController = (): IController => {
    // Compounding infra-layer (repositories implementations)
    const loadSurveyByIdRepository = new SurveyMongoRepository()
    const saveSurveyResultRepository = new SurveyResultMongoRepository()

    // Compounding data-layer
    const loadSurveyById = new DbLoadSurveyById(loadSurveyByIdRepository)
    const saveSurveyResult = new DbSaveSurveyResult(saveSurveyResultRepository)

    // Compounding presentation-layer (controllers with decorator)
    const loggerRepository = new LoggerRepository()
    const saveSurveyResultsController = new SaveSurveyResultController(
        loadSurveyById,
        saveSurveyResult,
    )

    // Factory for controller decorated
    return new ControllerWithLoggerDecorator(
        saveSurveyResultsController, 
        loggerRepository,
    )
}
