import { Router } from 'express'
import { ProductManager } from '../controllers/productManager.js'

const productManager = new ProductManager('src/models/products.json')
const routerProd = Router()

routerProd.get('/', async (req, res) => {
    const { limit } = req.query
    const prods = await productManager.getProducts()
    const products = prods.slice(0, limit)
    res.status(200).send(products)

})

routerProd.get('/:pid', async (req, res) => {
    const { pid } = req.params
    const prod = await productManager.getProductById(parseInt(pid))
    if (prod){
        res.status(200).send(prod)
    } else{
        res.status(404).send('Nonexistent product')
    }
})

routerProd.post('/', async (req, res) => {
    const confirmation = await productManager.addProduct(req.body)
    if (confirmation){
        res.status(200).send('Product created succesfully')
    } else{
        res.status(400).send('Product already exist')
    }
})

routerProd.put('/:pid', async (req, res) => {
    const confirmation = await productManager.updateProducts(parseInt(req.params.pid), req.body)
    if (confirmation)
        res.status(200).send('Product updated succesfully')
    else
        res.status(404).send('Product not found')

})

routerProd.delete('/:pid', async (req, res) => {
    const confirmation = await productManager.deleteProduct(parseInt(req.params.pid))
    if (confirmation)
        res.status(200).send('Product successfully removed')
    else
        res.status(404).send('Product not found')
})

export default routerProd