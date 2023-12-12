import 'dotenv/config'
import chai from 'chai'
import supertest from 'supertest'
import mongoose from 'mongoose'
import { logger } from '../src/utils/logger.js'

await mongoose
    .connect(process.env.MONGO_URL)
    .then(async () => {
        logger.info("MongoDB connected");
    })
    .catch((error) => console.log(`Error connecting to MongoDB Atlas: ${error}`));

const expect = chai.expect
const requester = supertest('http://localhost:4000')

describe('App tests', () => {
    describe('User register tests', async function () {
        it('Endpoint test /api/users, a new user is expected to be created', async function () {
            const newUser = {
				first_name: 'User',
				last_name: 'Test',
				email: 'user@test.com',
				age: 1234,
				password: '1234'
			}

            const { ok, _body} = requester.post('/api/users').send(newUser)
            logger.info(ok)
            logger.info(_body)
        })
    })
})