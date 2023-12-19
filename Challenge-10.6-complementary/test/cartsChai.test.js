import 'dotenv/config'
import chai from 'chai'
import mongoose from 'mongoose'
import cartModel from '../src/models/carts.models.js'
import { logger } from '../src/utils/logger.js'

await mongoose
    .connect(process.env.MONGO_URL)
    .then(async () => {
        logger.info("MongoDB connected");
    })
    .catch((error) => console.log(`Error connecting to MongoDB Atlas: ${error}`));

const expect = chai.expect

describe('Chai test for carts', () => {
    beforeEach(function () {
        this.timeout(7000)
    })

    it('Get all carts', async function () {
        const carts = await cartModel.find()
        expect(Array.isArray(carts)).to.be.ok
    })

    it('Create new cart', async function () {
        const result = await cartModel.create({})
        expect(result._id).to.be.ok
    })

    it('Get cart by id', async function () {
        const cart = await cartModel.findById()
        expect(typeof cart == 'object').to.be.ok
    })
})