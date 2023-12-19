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
    let cartId = ''
    let userId = ''
    const newUser = {
        first_name: 'User',
        last_name: 'Test',
        email: 'user@test.com',
        age: 1234,
        password: '1234'
    };

    it('Endpoint test /api/users/signin, a new user is expected to be created', async function () {
        this.timeout(7000)

        const { __body, status } = await requester.post('/api/users/signin').send(newUser)

        if (status === 302) {
            //User created succesfully
            expect(status).to.equal(302) // Código 302 porque al registrarse hace una redirección a la vista de inicio de sesión
            logger.info(`Status: ${__body}`)
        } else if (status === 401) {
            //User already exists
            expect(status).to.equal(401)
            logger.info(`User already exists: ${__body}`)
        } else {
            //Any other unexpected status
            throw new Error(`Unexpected status code: ${status}`)
        }
    });

    it('Endpoint test /api/sessions/login, a user is expected to log in', async function () {
        this.timeout(7000)

        const response = await requester.post('/api/sessions/login').send(newUser);
        const { __body } = response;
        const tokenResult = response.header['set-cookie'][0];

        expect(tokenResult).to.be.ok;
        expect(response.status).to.be.equal(302);//status(302) de nuevo por ser redirect

        token = {
            name: tokenResult.split('=')[0],
            value: tokenResult.split('=')[1]
        };

        expect(token).to.be.ok;
        expect(token.name).to.be.ok.and.equal('jwtCookie');
        expect(__body.cartId).to.be.ok
        userId = __body._id
        cartId = __body.cartId
        logger.info(`Token: ${token.name} = ${token.value}`); 
    });

    it('Endpoint test /api/sessions/current, it is expected to get the current user', async function () {
        const { statusCode, ok } = await requester
            .get('/api/sessions/current')
            .set('Cookie', [`jwtCookie=${token.value}`]);
        logger.info(statusCode, ok);
        logger.info(`Token: ${token.name} = ${token.value}`);
    });

    it('Endpoint test /api/carts/cid/product/pid, a product is expected to be added to the cart', async function () {
        const cid = cartId
        const pid = ''

        /* await requester.post(`/api/carts/${cid}/product/${pid}`).set('Cookie', [`${token.name} = ${token.value}`]) TO ADD TWICE THE SAME PRODUCT */ 
        const { __body, status } = await requester.post(`/api/carts/${cid}/product/${pid}`).set('Cookie', [`${token.name} = ${token.value}`])

        expect(status).to.equal(200)
        logger.info('Product added succesfully')
        logger.info(`Product: ${__body.products}`)
    })

    it('Endpoint test /api/carts/cid/product/pid, it is expected to modify the quantity of a product in the cart', async function () {
        const cid = cartId
        const pid = ''
        const newQty = { quantity : 10 }
        
        const { __body, status } = await requester.put(`/api/carts/${cid}/product/${pid}`).send(newQty).set('Cookie', [`${token.name} = ${token.value}`])

        expect(status).to.equal(200)
        logger.info('Updated product qty')
        logger.info(`Status: ${__body}`)
    })

    it('Endpoint test /api/user/uid, it is expected to delete an user', async function () {
        const uid = userId
        
        const { __body, status } = await requester.delete(`/api/users/${uid}`).set('Cookie', [`${token.name} = ${token.value}`])

        expect(status).to.equal(200)
        logger.info('User deleted succesfully')
        logger.info(`Status: ${__body}`)
    })
});