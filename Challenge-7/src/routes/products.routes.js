import { Router } from "express"
import { passportError, authorization } from "../utils/errorMessages.js"
import * as prodController from "../controllers/product.controller.js"

const productRouter = Router()

//Get all products
productRouter.get('/', prodController.getProducts)

//Get product by id
productRouter.get('/:id', prodController.getProduct)

//Create new product
productRouter.post('/', passportError('jwt'), authorization('admin'), prodController.postProduct)

//Put product
productRouter.put('/:id', prodController.putProduct)

//Delete product by id
productRouter.delete('/:id', prodController.deleteProducts)

export default productRouter