import { Router } from "express"
import { CartManager } from "../controllers/cartManager.js"

const cartManager = new CartManager('src/models/cart.json')
const routerCart = Router()

routerCart.post('/', async (req, res) => {
    const confirmation = await cartManager.createCart(req.body)
    if (confirmation){
        res.status(200).send('Cart added succesfully')
    } else{
        res.status(400).send('Cart already exist')
    }
})

routerCart.get('/:cid', async (req, res) => {
    const { cid } = req.params
    const cart = await cartManager.getCartById(parseInt(cid))
    if (cart){
        res.status(200).send(cart)
    } else{
        res.status(404).send('Nonexistent cart')
    }
})

routerCart.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const addProductToCart = await cartManager.addProductToCart(parseInt(cid), parseInt(pid))
    if(addProductToCart){
        res.status(200).send(addProductToCart)
    } else{
        res.status(404).send('Nonexistent product')
    }
})

routerCart.delete('/:cid', async (req, res) => {
    const confirmation = await cartManager.deleteCart(parseInt(req.params.cid))
    if (confirmation)
        res.status(200).send('Cart successfully removed')
    else
        res.status(404).send('Cart not found')
})

export default routerCart