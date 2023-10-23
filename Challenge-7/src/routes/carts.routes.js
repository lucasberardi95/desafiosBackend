import { Router } from "express"
import * as cartController from "../controllers/cart.controller.js"

const cartRouter = Router()

//Get all carts
cartRouter.get('/', cartController.getCarts)

//Get cart by id
cartRouter.get('/:id', cartController.getCart)

//Create new cart
cartRouter.post('/', cartController.postCart)

//Put cart with products array
cartRouter.put('/:cid', cartController.putCartWithProdsArray)

//Add product to cart
cartRouter.put('/:cid/product/:pid', cartController.putProductToCart)

//Put quantity of products on cart
cartRouter.put('/:cid/products/:pid', cartController.putProdQty)

//Delete product on cart by id
cartRouter.delete('/:cid/products/:pid', cartController.deleteProdOnCart)

//Empty cart
cartRouter.delete('/:id', cartController.emptyCart)

export default cartRouter