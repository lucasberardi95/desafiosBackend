import { ProductManager } from './main.js'

import express from 'express'

const manager = new ProductManager('./src/products.txt')
const app = express()
const PORT = 4000

app.use(express.urlencoded({ extended: true }))

app.get('/', async (req,res)=>{
    res.send('Welcome to Backend Challenge number 3')
})

app.get('/products', async (req, res)=>{
    const {limit} = req.query
    const prods = await manager.getProducts()
    if (limit){
        res.send(prods.slice(0, limit))
    } else {
    res.send(prods)
    }
}) 

app.get('/products/:id', async (req, res) => {
    const prod = await manager.getProductById(parseInt(req.params.id))
    if (prod){
        res.send(prod)
    } else {
        res.send("Product not found")
    }
}) 

app.get('*', (req, res) => {
    res.send("Error 404")
})

app.listen(PORT, ()=>{
    console.log(`Server on port ${PORT}`)
})

