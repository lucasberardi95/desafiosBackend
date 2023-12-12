import 'dotenv/config'
import mongoose from "mongoose"
import cartModel from "../src/models/carts.models.js"
import Assert from "assert"
import { logger } from '../src/utils/logger.js'

await mongoose
    .connect(process.env.MONGO_URL)
    .then(async () => {
        logger.info("MongoDB connected");
    })
    .catch((error) => console.log(`Error connecting to MongoDB Atlas: ${error}`));

const assert = Assert.strict

describe('Testing carts', () => {
    beforeEach(function () {
        this.timeout(7000)
    })

    it('Get all carts', async function () {
        const carts = await cartModel.find()
        assert.strictEqual(Array.isArray(carts), true)
    })

    it('Create new cart', async function () {
        const result = await cartModel.create({})
        assert.ok(result._id)
    })

    it('Get cart by id', async function () {
        const cart = await cartModel.findById()
        assert.strictEqual(typeof cart, 'object')
    })
})