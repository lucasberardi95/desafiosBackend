import 'dotenv/config'
import chai from 'chai'
import supertest from 'supertest'
import mongoose from 'mongoose'
import { logger } from '../src/utils/logger.js'
import { userModel } from '../src/models/users.models.js'
import productModel from '../src/models/products.models.js'
import cartModel from '../src/models/carts.models.js'

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
    let productId = ''
    const newUser = {
        first_name: 'User',
        last_name: 'Test',
        email: 'user@test.com',
        age: 1234,
        password: '1234'
    };

    it('Endpoint test /api/users/signin, a new user is expected to be created', async function () {
        this.timeout(7000)

        const { status } = await requester
        .post('/api/users/signin')
        .send(newUser)
        const user = await userModel.findOne({ email: newUser.email });

        if (status === 302) {
            //User created succesfully
            expect(status).to.equal(302) // Código 302 porque al registrarse hace una redirección a la vista de inicio de sesión
            logger.info(`User created succesfully. Status: ${status}`)
            logger.info(`User: ${user}`)
        } else if (status === 401) {
            //User already exists
            expect(status).to.equal(401)
            logger.info(`User already exists. Status: ${status}`)
        } else {
            //Any other unexpected status
            throw new Error(`Unexpected status code: ${status}`)
        }
    });

    it('Endpoint test /api/sessions/login, a user is expected to log in', async function () {
        this.timeout(7000)

        const { status, header} = await requester
        .post('/api/sessions/login')
        .send(newUser);
        const tokenResult = header['set-cookie'][0];

        expect(tokenResult).to.be.ok;
        expect(status).to.be.equal(302);//status(302) de nuevo por ser redirect
        logger.info(`Login status: ${status}`);
        token = {
            name: tokenResult.split('=')[0],
            value: tokenResult.split('=')[1]
        };

        expect(token).to.be.ok;
        expect(token.name).to.be.ok.and.equal('jwtCookie');

        const user = await userModel.findOne({ email: newUser.email })
        logger.info(user)
        userId = user._id
        cartId = user.cart._id
        logger.info(`Token: ${token.name} = ${token.value}`); 
    });

    it('Endpoint test /api/sessions/current, it is expected to get the current user', async function () {
        const { statusCode, ok } = await requester
            .get('/api/sessions/current')
            .set('Cookie', [`jwtCookie=${token.value}`]);
        logger.info(statusCode, ok);
        logger.info(`Token: ${token.name} = ${token.value}`);
    });

    it('Endpoint test /api/carts/:cid/product/:pid, a product is expected to be added to the cart', async function () {
        const cid = cartId
        const newProduct = await productModel.create({
            title:"test product",
            description:"this is a test product",
            price:100,
            stock:500,
            category:"testing",
            code:`test${Math.random().toString(36).substring(7)}`
        })
        productId = newProduct._id
        const quantity = 1 

        /* await requester.post(`/api/carts/${cid}/product/${productId}`).set('Cookie', [`${token.name} = ${token.value}`]) TO ADD TWICE THE SAME PRODUCT */ 
        const { status } = await requester
        .put(`/api/carts/${cid}/product/${productId}`)
        .send({ quantity })
        .set('Cookie', [`${token.name} = ${token.value}`])

        logger.info(`Status: ${status}`);

        expect(status).to.equal(200)

        logger.info('Product added succesfully')
        const productData = newProduct.toJSON()
        logger.info(`Product: `, productData)
    })

    it('Endpoint test /api/carts/:cid/products/:pid, it is expected to modify the quantity of a product in the cart', async function () {
        const cid = cartId
        const newQty = { quantity : 20 }
        
        const { status } = await requester
        .put(`/api/carts/${cid}/products/${productId}`)
        .send(newQty)
        .set('Cookie', [`${token.name} = ${token.value}`])

        expect(status).to.equal(200)

        const updatedCart = await cartModel.findById(cid)
        const updatedProduct = updatedCart.products.find(product => product.id_prod.toString() === productId.toString())
        if(updatedProduct){
            logger.info(`Product qty successfully updated, new qty: ${updatedProduct.quantity}`)
        }else {
            logger.error('Product not found in the updated cart.');
        }
        logger.info(`Status: ${status}`)
    })

    it('Endpoint test /api/users/deleteOne/:id, it is expected to delete an user', async function () {

        const { status } = await requester
        .delete(`/api/users/deleteOne/${userId}`)
        .set('Cookie', [`${token.name} = ${token.value}`])

        if (status === 200){
            await deleteCart(userId)
        }

        expect(status).to.equal(200)
        logger.info('User deleted succesfully')
        logger.info(`Status: ${status}`)

        async function deleteCart(userId) {
            const user = await userModel.findById(userId)
            if (user) {
                const cartId = user.cart
    
                if (cartId) {
                    await cartModel.findByIdAndDelete(cartId)
                    logger.info('Cart deleted successfully')
                }
            }
        }
    })
});