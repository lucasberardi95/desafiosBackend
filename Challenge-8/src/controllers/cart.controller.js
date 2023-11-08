import cartModel from "../models/carts.models.js"
import productModel from "../models/products.models.js"
import ticketModel from "../models/ticket.models.js"
import { userModel } from "../models/users.models.js"
import mongoose from "mongoose"

export const getCarts = async (req, res) => {
    try {
        const carts = await cartModel.find()
        res.status(200).send({ result: 'OK', message: carts })
    } catch (error) {
        res.status(400).send({ error: `Error displaying carts:  ${error}` })

    }
}

export const getCart = async (req, res) => {
    const { id } = req.params
    try {
        const cart = await cartModel.findById(id)
        res.status(200).send({ result: 'OK', message: cart })
    } catch (error) {
        res.status(400).send({ error: `Id cart not found:  ${error}` })
    }
}

export const postCart = async (req, res) => {
    const response = await cartModel.create(req.body)
    try {
        res.status(200).send({ result: 'OK', message: response })
    } catch (error) {
        res.status(400).send({ error: `Cart already exist: ${error}` })
    }
}

export const putCartWithProdsArray = async (req, res) => {
    const { cid } = req.params
    const arrayProds = req.body
    try {
        const cart = await cartModel.findById(cid)
        if (!cart) {
            res.status(404).send({ error: `Cart not found: ${error}` })
            return
        }
        arrayProds.forEach(async (productData) => {
            const { id_prod, quantity } = productData
            const existingProduct = cart.products.find((product) =>
                product.id_prod.equals(id_prod)
            )
            existingProduct
                ? (existingProduct.quantity += quantity)
                : cart.products.push({ id_prod, quantity })
        })
        await cart.save()
        res.status(200).send({ result: 'OK', cart })
    } catch (error) {
        res.status(200).send({ error: `Error updating cart: ${error}` })
    }
}

export const putProductToCart = async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body
    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            cart.products.push({ id_prod: pid, quantity: quantity })
            const response = await cartModel.findByIdAndUpdate(cid, cart)
            res.status(200).send({ result: 'OK', message: response })
        }
    } catch (error) {
        res.status(400).send({ error: `Error adding product: ${error}` })
    }
}

export const putProdQty = async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body
    try {
        const cart = await cartModel.findById(cid)
        if (!cart) {
            res.status(404).send({ result: `Id cart not found` })
            return
        }
        const existingProduct = cart.products.find((prod) =>
            prod.id_prod.equals(pid)
        )
        if (!existingProduct) {
            res.status(404).send({ result: `Product not found in cart` })
            return
        }
        existingProduct.quantity += quantity
        await cart.save()
        res.status(200).send({ result: 'OK', cart })
    } catch (error) {
        res.status(400).send({ error: `Error updating product qty: ${error}` })
    }
}

export const deleteProdOnCart = async (req, res) => {
    const { cid, pid } = req.params
    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            const productIndex = cart.products.findIndex(prod => prod.id_prod.equals(new mongoose.Types.ObjectId(pid)))
            let deletedProduct
            if (productIndex !== -1) {
                deletedProduct = cart.products[productIndex]
                cart.products.splice(productIndex, 1)
            } else {
                res.status(404).send({ result: 'Id Product Not Found', message: cart })
            }
            await cart.save()
            res.status(200).send({ result: 'OK', message: deletedProduct })
        } else {
            res.status(404).send({ result: 'Cart Not Found', message: cart })
        }
    } catch (error) {
        res.status(400).send({ error: `Error deleting product: ${error}` })
    }
}

export const emptyCart = async (req, res) => {
    const { id } = req.params
    try {
        const cart = await cartModel.findById(id)
        if (!cart) {
            res.status(404).send({ result: 'Cart not found', message: cart })
        }
        cart.products = []
        await cart.save()
        res.status(200).send({ result: 'OK', message: cart })
    } catch (error) {
        res.status(400).send({ error: `Error empitying cart: ${cart}` })
    }
}

export const purchase = async (req, res) => {
    const { cid } = req.params
    try {
        const cart = await cartModel.findById(cid)
        const products = await productModel.find()
        const user = await userModel.find({ cart: cart._id})
        const purchaserEmail = user[0].email

        if (!cart) {
            return res.status(404).send({ result: 'Cart not found', message: cart })
        }

        const promises = cart.products.map(async (item) => {
            const product = await productModel.findById(item.id_prod)
            if (!product) {
                throw new Error('Product not found')
            }

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity
                await product.save()
                return { productId: product._id, quantity: item.quantity, price: product.price }
            }
            return null // Retornar null si el producto no tiene suficiente stock
        })

        const results = await Promise.all(promises)
        const prodsToPurchase = results.filter((result) => result !== null)
        console.log(`Products to purchase: ${JSON.stringify(prodsToPurchase)}`)

        if (prodsToPurchase.length === 0) {
            return res.status(400).send({ result: 'No products to purchase' })
        }

        const purchase = {
            items: prodsToPurchase,
            total: prodsToPurchase.reduce((acc, product) => {
                return acc + product.price * product.quantity
            }, 0),
        }

        const ticket = {
            amount: purchase.total,
            purchaser: purchaserEmail
        }
        await ticketModel.create(ticket)
        console.log(`Successful purchase, your total to pay is: $${ticket.amount}`)
        await cartModel.findByIdAndUpdate(cid, { products: [] })
        return res.status(200).send({ message: "Successful purchase" })
    } catch (error) {
        return res.status(404).send({ error: `Error processing the purchase: ${error.message}` })
    }
}