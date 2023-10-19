import { Router } from "express"
import { deleteProdOnCart, emptyCart, getCart, getCarts, postCart, putCartWithProdsArray, putProdQty, putProductToCart } from "../controllers/cart.controller.js"

const cartRouter = Router()

//Get all carts
cartRouter.get('/', getCarts)

//Get cart by id
cartRouter.get('/:id', getCart)

//Create new cart
cartRouter.post('/', postCart)

//Put cart with products array
cartRouter.put('/:cid', putCartWithProdsArray)

//Add product to cart
cartRouter.put('/:cid/product/:pid', putProductToCart)

//Put quantity of products on cart
cartRouter.put('/:cid/products/:pid', putProdQty)

//Delete product on cart by id
cartRouter.delete('/:cid/products/:pid', deleteProdOnCart)

//Empty cart
cartRouter.delete('/:id', emptyCart)

export default cartRouter