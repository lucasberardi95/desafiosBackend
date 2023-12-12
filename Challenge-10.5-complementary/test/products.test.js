import 'dotenv/config'
import mongoose from 'mongoose'
import productModel from '../src/models/products.models.js'
import Assert from 'assert'
import { logger } from '../src/utils/logger.js'

await mongoose
    .connect(process.env.MONGO_URL)
    .then(async () => {
        logger.info("MongoDB connected");
    })
    .catch((error) => console.log(`Error connecting to MongoDB Atlas: ${error}`));

const assert = Assert.strict

describe('Testing Products', () => {
    beforeEach(function () {
        this.timeout(7000)
    })

    let id

    it('Create new product', async function () {
        const newProduct = {
            title: 'Test product',
            description: 'This is a test product',
            category: 'Testing',
            price: 10,
            stock: 500,
            code: 'test123',
        }
        const resultado = await productModel.create(newProduct)
        id = resultado._id
        assert.ok(resultado._id)
    })

    it('Get product by id', async function () {
        const product = await productModel.findById(id)
        assert.strictEqual(typeof product, 'object')
    })

    it('Delete product by id', async function () {
        const product = await productModel.findByIdAndRemove(id)
        assert.strictEqual(typeof product, 'object')
    })

    it('Get all products', async function () {
        const products = await productModel.find()
        assert.strictEqual(Array.isArray(products), true)
    })
})