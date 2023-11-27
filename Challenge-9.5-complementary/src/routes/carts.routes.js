import { Router } from "express"
import { passportError, authorization } from "../utils/errorMessages.js"
import * as cartController from "../controllers/cart.controller.js"

const cartRouter = Router()

//Get all carts
cartRouter.get('/', cartController.getCarts)

//Get cart by id
cartRouter.get('/:id', cartController.getCart)

//Create new cart
cartRouter.post('/', cartController.postCart)

//Put cart with products array
cartRouter.put('/:cid', passportError('jwt'), authorization(['user', 'premium']), cartController.putCartWithProdsArray)

//Add product to cart
cartRouter.put('/:cid/product/:pid', passportError('jwt'), authorization(['user', 'premium']), cartController.putProductToCart)

//Put quantity of products on cart
cartRouter.put('/:cid/products/:pid', passportError('jwt'), authorization(['user', 'premium']), cartController.putProdQty)

//Delete product on cart by id
cartRouter.delete('/:cid/products/:pid', passportError('jwt'), authorization(['user', 'premium']), cartController.deleteProdOnCart)

//Empty cart
cartRouter.delete('/:id', passportError('jwt'), authorization(['user', 'premium']), cartController.emptyCart)

//Checkout - finalize purchase
cartRouter.post('/:cid/purchase', passportError('jwt'), authorization(['user', 'premium']), cartController.purchase)


export default cartRouter