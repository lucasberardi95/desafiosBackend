import 'dotenv/config' // Me permite usar variables de entorno
import express from "express"
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { __dirname } from './path.js'
import path from 'path'
import productRouter from "./routes/products.routes.js"
import cartRouter from "./routes/carts.routes.js"
import messageRouter from "./routes/messages.routes.js"
import userRouter from './routes/users.routes.js'
import sessionRouter from './routes/sessions.routes.js'
import { messagesSocketController } from "./controllers/sockets/messagesSocketController.js"
import cookieParser from 'cookie-parser'
import session from 'express-session'
//import FileStorage from 'session-file-store'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose'
import productModel from './models/products.models.js'

const app = express()
//const fileStorage = FileStorage(session)
const PORT = 4000

//Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})
const io = new Server(server)

//Conexion de Socket.io
io.on('connection', (socket) => {
    console.log('Socket.io connection')
    socket.on('message', (info) => messagesSocketController(io, info))
})

//MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log('DB connected')
    })
    .catch((error) => console.log(`Error connecting to MongoDB Atlas: ${error}`))

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.SIGNED_COOKIE)) //Firmo la cookie para que no puedan modificarlas o si las modifican que queden invalidas
app.use(session({ //Configuracion de la sesion de mi app
    //store: new fileStorage({path: './sessions', ttl: 10000, retries: 1}),
    store: MongoStore.create({
        mongoUrl:process.env.MONGO_URL,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 10 // (Esto es en segundos,  no milisegundos)
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

function auth (req, res, next){
    console.log(req.session.email)
    if (req.session.email == 'admin@admin.com' && pasword == '1234') {
        return next() //Continua con la ejecucion normal de la ruta
    } else {
        res.send('You do not have access to this content')
    }
}

//SESSIONS
app.get('/session', (req, res)=>{
    if (req.session.counter) {
        req.session.counter++
        res.send(`You have logged in ${req.session.counter} times to my page.`)
    } else {
        req.session.counter = 1
        res.send(`Hi for the first time`)
    }
})

//Log in
app.get('/login', (req, res)=>{
    const {email, password} = req.body
    // if (email == 'admin@admin.com' && password == '1234') { 
        req.session.email = email
        req.session.password = password
        return res.send('Logged in user')
    // } else {
    //    return res.send('Failed login')
    // } 
})

app.get('/admin', auth, (req, res)=>{
    res.send('Hi admin')
})

//Log out
app.get('/logout', (req, res)=>{
    req.session.destroy((error)=>{
        if (error) {
            console.log(error)
        } else {
            res.send('Logged out')            
        }
    })
})

//Routes
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/messages', messageRouter)
app.use('/api/users', userRouter)
app.use('/api/sessions', sessionRouter)

app.get('/static/chat', (req, res) => {
    res.render('chat', {
        rutaCSS: 'chat',
        rutaJS: 'chat',
    })
})

app.get('/static/products', async (req, res) =>{
    const products = await productModel.find().lean()
    const info = req.query.info
    res.render('products', {
        rutaCSS: 'products',
        rutaJS: 'products',
        products,
        info,
    })
})

app.get('/static/signin', (req, res) =>{
    res.render('signin', {
        rutaCSS: 'signin',
        rutaJS: 'signin',
    })
})

app.get('/static/login', (req, res) =>{
    res.render('login', {
        rutaCSS: 'login',
        rutaJS: 'login',
    })
})

app.get('/static/logout', (req, res) =>{
    res.render('logout', {
        rutaCSS: 'logout',
        rutaJS: 'logout',
    })
})

//HBS configuration
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, 'views'))

//Cookies
app.get('/setCookie', (req, res) => {
    res.cookie('Cookie1', 'Este es el valor de una cookie', { maxAge: 60000, signed: true }).send('Cookie creada') //Cookie de un minuto firmada
})

app.get('/getCookie', (req, res) => {
    res.send(req.signedCookies) // Consulta solo las cookies firmadas
    //res.send(req.cookies) Consulta TODAS las cookies
})