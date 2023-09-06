import express from "express"
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { __dirname } from './path.js'
import path from 'path'
import mongoose from "mongoose"
import productRouter from "./routes/products.routes.js"
import cartRouter from "./routes/carts.routes.js"
import messageRouter from "./routes/messages.routes.js"
import messageModel from "./models/messages.models.js"

const app = express()
const PORT = 4000

//Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})
const io = new Server(server)

//Conexion de Socket.io
io.on('connection', (socket)=>{
    console.log('Socket.io connection')
    socket.on('message', async info =>{
        //const {email, message} = info
        await messageModel.create(info)
        const messages = await messageModel.find()
        io.emit('messages', messages)
    })
})

//MongoDB Atlas connection
mongoose.connect('mongodb+srv://lucasberardi17:lucas1234@cluster0.rjyqxv4.mongodb.net/?retryWrites=true&w=majority')
.then(()=> console.log('DB connected'))
.catch((error)=> console.log(`Error connecting to MongoDB Atlas: ${error}`))

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Routes
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/messages', messageRouter)

app.get('/static', (req,res)=>{
    res.render('chat',{
        rutaCSS: 'chat',
        rutaJS: 'chat',
    })
})

//HBS configuration
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, 'views'))