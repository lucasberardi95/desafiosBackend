import { Router } from "express";
import { passportError, authorization } from "../utils/errorMessages.js"
import * as loggerController from "../controllers/logger.controller.js"

const loggerRouter = Router()

loggerRouter.get('/', passportError('jwt'), authorization('admin'), loggerController.getLogs)

export default loggerRouter