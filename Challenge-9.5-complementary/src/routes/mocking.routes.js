import { Router } from "express"
import { passportError, authorization } from "../utils/errorMessages.js"
import * as mockingController from "../controllers/mocking.controller.js"

const mockingRouter = Router()

//Mocking products
mockingRouter.post('/', passportError('jwt'), authorization('admin'), mockingController.createProduct)

export default mockingRouter