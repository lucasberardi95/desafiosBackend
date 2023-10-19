import { Router } from "express"
import { passportError, authorization } from "../utils/errorMessages.js"
import { getProducts, getProduct, postProduct, putProduct, deleteProducts } from "../controllers/product.controller.js"

const productRouter = Router()

//Get all products
productRouter.get('/', getProducts)

//Get product by id
productRouter.get('/:id', getProduct)

//Create new product
productRouter.post('/', passportError('jwt'), authorization('admin'), postProduct)

//Put product
productRouter.put('/:id', putProduct)

//Delete product by id
productRouter.delete('/:id', deleteProducts)

export default productRouter