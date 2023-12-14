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
    let token = {}

    it('Endpoint test /api/users/signin, a new user is expected to be created', async function () {
        this.timeout(7000)
        const newUser = {
            first_name: 'User',
            last_name: 'Test',
            email: 'user@test.com',
            age: 1234,
            password: '1234'
        };

        const { __body, status } = await requester.post('/api/users/signin').send(newUser);

        //expect(status).to.equal(200);
        expect(status).to.equal(302); //Puse codigo 302 porque al registrarse hace una redireccion a la vista de login
        logger.info(`Status: ${__body}`);
    });

    it('Endpoint test /api/sessions/login, a user is expected to log in', async function () {
        this.timeout(7000)

        const newUser = {
            email: 'user@test.com',
            password: '1234'
        };

        const response = await requester.post('/api/sessions/login').send(newUser);
        const tokenResult = response.header['set-cookie'][0];

        expect(tokenResult).to.be.ok;
        expect(response.status).to.be.equal(302);//status(302) de nuevo por ser redirect

        token = {
            name: tokenResult.split('=')[0],
            value: tokenResult.split('=')[1]
        };

        expect(token).to.be.ok;
        expect(token.name).to.be.ok.and.equal('jwtCookie');

        logger.info(`Token: ${token.name} = ${token.value}`);
    });

    it('Endpoint test /api/sessions/current, it is expected to get the current user', async function () {
        const { statusCode, ok } = await requester
            .get('/api/sessions/current')
            .set('Cookie', [`jwtCookie=${token.value}`]);
        console.log(statusCode, ok);
    });
});