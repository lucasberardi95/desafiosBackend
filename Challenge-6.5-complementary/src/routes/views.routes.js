import { Router } from "express";
import productModel from '../models/products.models.js'

const viewRouter = Router()

viewRouter.get('/static/chat', (req, res) => {
    res.render('chat', {
        rutaCSS: 'chat',
        rutaJS: 'chat',
    })
})

viewRouter.get('/static/products', async (req, res) =>{
    const products = await productModel.find().lean()
    const info = req.query.info
    res.render('products', {
        rutaCSS: 'products',
        rutaJS: 'products',
        products,
        info,
    })
})

viewRouter.get('/static/signin', (req, res) =>{
    res.render('signin', {
        rutaCSS: 'signin',
        rutaJS: 'signin',
    })
})

viewRouter.get('/static/login', (req, res) =>{
    res.render('login', {
        rutaCSS: 'login',
        rutaJS: 'login',
    })
})

viewRouter.get('/static/logout', (req, res) =>{
    res.render('logout', {
        rutaCSS: 'logout',
        rutaJS: 'logout',
    })
})

export default viewRouter