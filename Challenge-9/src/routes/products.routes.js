import { Router } from "express"
import { passportError, authorization } from "../utils/errorMessages.js"
import * as prodController from "../controllers/product.controller.js"
import CustomError from "../services/Errors/CustomError.js"
import { EErrors } from "../services/errors/enums.js"
import { generateProductErrorInfo } from "../services/errors/info.js"

const productRouter = Router()

//Get all products
productRouter.get('/', prodController.getProducts)

//Get product by id
productRouter.get('/:id', prodController.getProduct)

//Create new product
productRouter.post('/', (req, res,next) => {
    const { title, description, stock, price, code, category } = req.body
    try {
        if ((!title, !description, !stock, !price, !code, !category)) {
            CustomError.createError({
                name: 'Error creating product',
                cause: generateProductErrorInfo({ title, description, stock, price, code, category }),
                message: 'All fields must be completed',
                code: EErrors.PRODUCT_ERROR,
            })
        }
        next()
    } catch (error) {
        next(error)
    }
}, passportError('jwt'), authorization('admin'), prodController.postProduct)

//Put product
productRouter.put('/:id', passportError('jwt'), authorization('admin'), prodController.putProduct)

//Delete product by id
productRouter.delete('/:id', passportError('jwt'), authorization('admin'), prodController.deleteProducts)

export default productRouter