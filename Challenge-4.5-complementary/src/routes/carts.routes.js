import { Router } from "express"
import cartModel from "../models/carts.models.js"
import productModel from "../models/products.models.js"
import mongoose from "mongoose"

const cartRouter = Router()

cartRouter.get('/', async (req,res)=>{
    try {
        const carts = await cartModel.find()
        res.status(200).send({result: 'OK', message: carts})
    } catch (error) {
        res.status(400).send({error: `Error displaying carts:  ${error}`})
    
    }
})

cartRouter.get('/:id', async (req,res)=>{
    const {id} = req.params
    try {
        const cart = await cartModel.findById(id)
        res.status(200).send({result: 'OK', message: cart})
    } catch (error) {
        res.status(400).send({error: `Id cart not found:  ${error}`})
    
    }
})

cartRouter.post('/', async (req, res) => {
    const response = await cartModel.create(req.body)
    try {
        res.status(200).send({result: 'OK', message: response})
    } catch (error) {
        res.status(400).send({error: `Cart already exist: ${error}`})
    }
    
})

cartRouter.put('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params
    try {
        const cartId = await cartModel.findById(cid)
        if (cartId) {
            const productId = await productModel.findById(pid)
            if (!productId) {
                res.status(404).send({ result: 'Id product Not Found', message: productId })
                return
            }
        const existingProduct = cartId.products.find(prod => prod.id_prod == pid)
            if (existingProduct) {
            existingProduct.quantity++
            } else {
            cartId.products.push({ id_prod: productId._id, quantity: 1 })
            }

            //Save cart changes in mongoDB
            await cartId.save()
            res.status(200).send({ result: 'OK', message: cartId })
        } else {
            res.status(404).send({ result: 'Id cart Not Found', message: cartId })
        }
    } catch (error) {
        res.status(400).send({ error: `Error adding product: ${error}` })
    }
})

cartRouter.delete('/:id', async (req, res) => {
    const {id} = req.params
    const response = await cartModel.deleteOne({_id: id})
    if (response)
        res.status(200).send({result: 'OK ', message: response})
    else
        res.status(404).send({error: `Id cart not found: ${error}`})
})

export default cartRouter